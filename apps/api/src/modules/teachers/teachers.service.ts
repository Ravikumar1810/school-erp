import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import {
  and,
  desc,
  eq,
} from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import { DATABASE_CONNECTION } from "../../database/database.constants";
import * as schema from "../../database/schema/user.schema";
import { users } from "../../database/schema/user.schema";

import { UserRole } from "../../common/enums/user-role.enum";

import { CreateTeacherDto } from "./dto/create-teacher.dto";

export interface TeacherResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class TeachersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<
      typeof schema
    >,
  ) {}

  async create(
    createTeacherDto: CreateTeacherDto,
  ): Promise<TeacherResponse> {
    const email =
      createTeacherDto.email
        .trim()
        .toLowerCase();

    const [existingUser] =
      await this.database
        .select({
          id: users.id,
        })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    if (existingUser) {
      throw new ConflictException(
        "A user with this email already exists.",
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        createTeacherDto.password,
        12,
      );

    const [teacher] =
      await this.database
        .insert(users)
        .values({
          name:
            createTeacherDto.name.trim(),
          email,
          password: hashedPassword,
          role: UserRole.ADMIN,
          isActive: true,
        })
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          avatar: users.avatar,
          isActive: users.isActive,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        });

    if (!teacher) {
      throw new Error(
        "Failed to create teacher.",
      );
    }

    return {
      ...teacher,
      role: teacher.role as UserRole,
    };
  }

  async findAll(): Promise<
    TeacherResponse[]
  > {
    const teachers =
      await this.database
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          avatar: users.avatar,
          isActive: users.isActive,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(
          eq(
            users.role,
            UserRole.ADMIN,
          ),
        )
        .orderBy(
          desc(users.createdAt),
        );

    return teachers.map(
      (teacher) => ({
        ...teacher,
        role:
          teacher.role as UserRole,
      }),
    );
  }

  async findOne(
    id: string,
  ): Promise<TeacherResponse> {
    const [teacher] =
      await this.database
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          avatar: users.avatar,
          isActive: users.isActive,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(
          and(
            eq(users.id, id),
            eq(
              users.role,
              UserRole.ADMIN,
            ),
          ),
        )
        .limit(1);

    if (!teacher) {
      throw new NotFoundException(
        "Teacher not found.",
      );
    }

    return {
      ...teacher,
      role: teacher.role as UserRole,
    };
  }

  async remove(
    id: string,
  ): Promise<{
    message: string;
  }> {
    const [teacher] =
      await this.database
        .select({
          id: users.id,
        })
        .from(users)
        .where(
          and(
            eq(users.id, id),
            eq(
              users.role,
              UserRole.ADMIN,
            ),
          ),
        )
        .limit(1);

    if (!teacher) {
      throw new NotFoundException(
        "Teacher not found.",
      );
    }

    await this.database
      .delete(users)
      .where(
        and(
          eq(users.id, id),
          eq(
            users.role,
            UserRole.ADMIN,
          ),
        ),
      );

    return {
      message:
        "Teacher deleted successfully.",
    };
  }
}