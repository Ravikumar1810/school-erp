import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

import {
  eq,
} from "drizzle-orm";

import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import * as bcrypt from "bcrypt";

import { DATABASE_CONNECTION } from "../../database/database.constants";

import { users } from "../../database/schema/user.schema";
import { students } from "../../database/schema/student.schema";

import { UserRole } from "../../common/enums/user-role.enum";

import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";

const databaseSchema = {
  users,
  students,
};

export interface BaseProfileResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentProfileDetails {
  id: string;
  admissionNumber: string;
  className: string;
  section: string;
  rollNumber: string;
  dateOfBirth: string | null;
  parentName: string | null;
  parentPhone: string | null;
}

export interface ProfileResponse extends BaseProfileResponse {
  student: StudentProfileDetails | null;
}

@Injectable()
export class ProfileService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database:
      NodePgDatabase<
        typeof databaseSchema
      >,
  ) {}

  async getMyProfile(
    userId: string,
  ): Promise<ProfileResponse> {
    const [user] =
      await this.database
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          avatar: users.avatar,
          isActive:
            users.isActive,
          createdAt:
            users.createdAt,
          updatedAt:
            users.updatedAt,
        })
        .from(users)
        .where(
          eq(
            users.id,
            userId,
          ),
        )
        .limit(1);

    if (!user) {
      throw new NotFoundException(
        "User profile not found.",
      );
    }

    if (
      user.role !==
      UserRole.STUDENT
    ) {
      return {
        ...user,
        student: null,
      };
    }

    const [student] =
      await this.database
        .select({
          id: students.id,

          admissionNumber:
            students.admissionNumber,

          className:
            students.className,

          section:
            students.section,

          rollNumber:
            students.rollNumber,

          dateOfBirth:
            students.dateOfBirth,

          parentName:
            students.parentName,

          parentPhone:
            students.parentPhone,
        })
        .from(students)
        .where(
          eq(
            students.userId,
            userId,
          ),
        )
        .limit(1);

    return {
  ...user,
  student: student ?? null,
};
  }

  async updateMyProfile(
    userId: string,
    updateProfileDto:
      UpdateProfileDto,
  ): Promise<ProfileResponse> {
    const existingProfile =
      await this.getMyProfile(
        userId,
      );

    const updates: {
      name?: string;
      avatar?: string | null;
      updatedAt: Date;
    } = {
      updatedAt:
        new Date(),
    };

    if (
      updateProfileDto.name !==
      undefined
    ) {
      const name =
        updateProfileDto.name.trim();

      if (name.length < 2) {
        throw new BadRequestException(
          "Name must contain at least 2 characters.",
        );
      }

      updates.name = name;
    }

    if (
      updateProfileDto.avatar !==
      undefined
    ) {
      updates.avatar =
        updateProfileDto.avatar.trim() ||
        null;
    }

    if (
      !updates.name &&
      updates.avatar === undefined
    ) {
      return existingProfile;
    }

    await this.database
      .update(users)
      .set(updates)
      .where(
        eq(
          users.id,
          userId,
        ),
      );

    return this.getMyProfile(
      userId,
    );
  }

  async changePassword(
    userId: string,
    changePasswordDto:
      ChangePasswordDto,
  ): Promise<{
    message: string;
  }> {
    const [user] =
      await this.database
        .select({
          id: users.id,
          password:
            users.password,
        })
        .from(users)
        .where(
          eq(
            users.id,
            userId,
          ),
        )
        .limit(1);

    if (!user) {
      throw new NotFoundException(
        "User not found.",
      );
    }

    const isCurrentPasswordValid =
      await bcrypt.compare(
        changePasswordDto
          .currentPassword,
        user.password,
      );

    if (
      !isCurrentPasswordValid
    ) {
      throw new UnauthorizedException(
        "Current password is incorrect.",
      );
    }

    const isSamePassword =
      await bcrypt.compare(
        changePasswordDto
          .newPassword,
        user.password,
      );

    if (isSamePassword) {
      throw new BadRequestException(
        "New password must be different from the current password.",
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        changePasswordDto
          .newPassword,
        12,
      );

    await this.database
      .update(users)
      .set({
        password:
          hashedPassword,

        updatedAt:
          new Date(),
      })
      .where(
        eq(
          users.id,
          userId,
        ),
      );

    return {
      message:
        "Password changed successfully.",
    };
  }
}