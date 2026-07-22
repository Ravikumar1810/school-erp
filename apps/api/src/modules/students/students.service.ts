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
  ne,
} from "drizzle-orm";

import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import { UserRole } from "../../common/enums/user-role.enum";

import { DATABASE_CONNECTION } from "../../database/database.constants";

import * as userSchema from "../../database/schema/user.schema";
import { users } from "../../database/schema/user.schema";

import { students } from "../../database/schema/student.schema";

import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";

const databaseSchema = {
  ...userSchema,
  students,
};

export interface StudentResponse {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  isActive: boolean;

  admissionNumber: string;
  className: string;
  section: string;
  rollNumber: string;

  dateOfBirth: string | null;
  parentName: string | null;
  parentPhone: string | null;

  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class StudentsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<
      typeof databaseSchema
    >,
  ) {}

  async create(
    createStudentDto: CreateStudentDto,
  ): Promise<StudentResponse> {
    const email =
      createStudentDto.email
        .trim()
        .toLowerCase();

    const admissionNumber =
      createStudentDto.admissionNumber.trim();

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

    const [existingStudent] =
      await this.database
        .select({
          id: students.id,
        })
        .from(students)
        .where(
          eq(
            students.admissionNumber,
            admissionNumber,
          ),
        )
        .limit(1);

    if (existingStudent) {
      throw new ConflictException(
        "A student with this admission number already exists.",
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        createStudentDto.password,
        12,
      );

    const studentId =
      await this.database.transaction(
        async (tx) => {
          const [createdUser] =
            await tx
              .insert(users)
              .values({
                name:
                  createStudentDto.name.trim(),
                email,
                password:
                  hashedPassword,
                role:
                  UserRole.STUDENT,
                isActive: true,
              })
              .returning({
                id: users.id,
              });

          if (!createdUser) {
            throw new Error(
              "Failed to create student user account.",
            );
          }

          const [createdStudent] =
            await tx
              .insert(students)
              .values({
                userId:
                  createdUser.id,

                admissionNumber,

                className:
                  createStudentDto.className.trim(),

                section:
                  createStudentDto.section.trim(),

                rollNumber:
                  createStudentDto.rollNumber.trim(),

                dateOfBirth:
                  createStudentDto.dateOfBirth,

                parentName:
                  createStudentDto.parentName?.trim(),

                parentPhone:
                  createStudentDto.parentPhone?.trim(),
              })
              .returning({
                id: students.id,
              });

          if (!createdStudent) {
            throw new Error(
              "Failed to create student profile.",
            );
          }

          return createdStudent.id;
        },
      );

    return this.findOne(studentId);
  }

  async findAll(): Promise<
    StudentResponse[]
  > {
    const result =
      await this.database
        .select({
          id: students.id,
          userId: students.userId,

          name: users.name,
          email: users.email,
          role: users.role,
          avatar: users.avatar,
          isActive: users.isActive,

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

          createdAt:
            students.createdAt,

          updatedAt:
            students.updatedAt,
        })
        .from(students)
        .innerJoin(
          users,
          eq(
            students.userId,
            users.id,
          ),
        )
        .where(
          eq(
            users.role,
            UserRole.STUDENT,
          ),
        )
        .orderBy(
          desc(students.createdAt),
        );

    return result.map(
      (student) => ({
        ...student,
        role:
          student.role as UserRole,
      }),
    );
  }

  async findOne(
    id: string,
  ): Promise<StudentResponse> {
    const [student] =
      await this.database
        .select({
          id: students.id,
          userId: students.userId,

          name: users.name,
          email: users.email,
          role: users.role,
          avatar: users.avatar,
          isActive: users.isActive,

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

          createdAt:
            students.createdAt,

          updatedAt:
            students.updatedAt,
        })
        .from(students)
        .innerJoin(
          users,
          eq(
            students.userId,
            users.id,
          ),
        )
        .where(
          and(
            eq(students.id, id),
            eq(
              users.role,
              UserRole.STUDENT,
            ),
          ),
        )
        .limit(1);

    if (!student) {
      throw new NotFoundException(
        "Student not found.",
      );
    }

    return {
      ...student,
      role:
        student.role as UserRole,
    };
  }

  async findMyProfile(
    userId: string,
  ): Promise<StudentResponse> {
    const [student] =
      await this.database
        .select({
          id: students.id,
          userId: students.userId,

          name: users.name,
          email: users.email,
          role: users.role,
          avatar: users.avatar,
          isActive: users.isActive,

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

          createdAt:
            students.createdAt,

          updatedAt:
            students.updatedAt,
        })
        .from(students)
        .innerJoin(
          users,
          eq(
            students.userId,
            users.id,
          ),
        )
        .where(
          and(
            eq(
              students.userId,
              userId,
            ),
            eq(
              users.role,
              UserRole.STUDENT,
            ),
          ),
        )
        .limit(1);

    if (!student) {
      throw new NotFoundException(
        "Student profile not found.",
      );
    }

    return {
      ...student,
      role:
        student.role as UserRole,
    };
  }

  async update(
    id: string,
    updateStudentDto:
      UpdateStudentDto,
  ): Promise<StudentResponse> {
    const existingStudent =
      await this.findOne(id);

    const normalizedEmail =
      updateStudentDto.email
        ?.trim()
        .toLowerCase();

    if (normalizedEmail) {
      const [emailOwner] =
        await this.database
          .select({
            id: users.id,
          })
          .from(users)
          .where(
            and(
              eq(
                users.email,
                normalizedEmail,
              ),
              ne(
                users.id,
                existingStudent.userId,
              ),
            ),
          )
          .limit(1);

      if (emailOwner) {
        throw new ConflictException(
          "A user with this email already exists.",
        );
      }
    }

    const normalizedAdmissionNumber =
      updateStudentDto
        .admissionNumber
        ?.trim();

    if (
      normalizedAdmissionNumber
    ) {
      const [admissionOwner] =
        await this.database
          .select({
            id: students.id,
          })
          .from(students)
          .where(
            and(
              eq(
                students.admissionNumber,
                normalizedAdmissionNumber,
              ),
              ne(
                students.id,
                id,
              ),
            ),
          )
          .limit(1);

      if (admissionOwner) {
        throw new ConflictException(
          "A student with this admission number already exists.",
        );
      }
    }

    await this.database.transaction(
      async (tx) => {
        const userUpdates: {
          name?: string;
          email?: string;
          updatedAt?: Date;
        } = {};

        if (
          updateStudentDto.name !==
          undefined
        ) {
          userUpdates.name =
            updateStudentDto.name.trim();
        }

        if (
          normalizedEmail !==
          undefined
        ) {
          userUpdates.email =
            normalizedEmail;
        }

        if (
          Object.keys(userUpdates)
            .length > 0
        ) {
          userUpdates.updatedAt =
            new Date();

          await tx
            .update(users)
            .set(userUpdates)
            .where(
              eq(
                users.id,
                existingStudent.userId,
              ),
            );
        }

        const studentUpdates: {
          admissionNumber?: string;
          className?: string;
          section?: string;
          rollNumber?: string;
          dateOfBirth?: string;
          parentName?: string;
          parentPhone?: string;
          updatedAt: Date;
        } = {
          updatedAt: new Date(),
        };

        if (
          normalizedAdmissionNumber !==
          undefined
        ) {
          studentUpdates.admissionNumber =
            normalizedAdmissionNumber;
        }

        if (
          updateStudentDto.className !==
          undefined
        ) {
          studentUpdates.className =
            updateStudentDto.className.trim();
        }

        if (
          updateStudentDto.section !==
          undefined
        ) {
          studentUpdates.section =
            updateStudentDto.section.trim();
        }

        if (
          updateStudentDto.rollNumber !==
          undefined
        ) {
          studentUpdates.rollNumber =
            updateStudentDto.rollNumber.trim();
        }

        if (
          updateStudentDto.dateOfBirth !==
          undefined
        ) {
          studentUpdates.dateOfBirth =
            updateStudentDto.dateOfBirth;
        }

        if (
          updateStudentDto.parentName !==
          undefined
        ) {
          studentUpdates.parentName =
            updateStudentDto.parentName.trim();
        }

        if (
          updateStudentDto.parentPhone !==
          undefined
        ) {
          studentUpdates.parentPhone =
            updateStudentDto.parentPhone.trim();
        }

        await tx
          .update(students)
          .set(studentUpdates)
          .where(
            eq(students.id, id),
          );
      },
    );

    return this.findOne(id);
  }

  async remove(
    id: string,
  ): Promise<{
    message: string;
  }> {
    const student =
      await this.findOne(id);

    // Because students.userId references users.id
    // with ON DELETE CASCADE, deleting the user
    // automatically deletes the student profile.
    await this.database
      .delete(users)
      .where(
        eq(
          users.id,
          student.userId,
        ),
      );

    return {
      message:
        "Student deleted successfully.",
    };
  }
}