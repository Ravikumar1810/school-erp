import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  and,
  desc,
  eq,
} from "drizzle-orm";

import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import { DATABASE_CONNECTION } from "../../database/database.constants";

import {
  attendance,
  type AttendanceStatus,
} from "../../database/schema/attendance.schema";

import { students } from "../../database/schema/student.schema";
import { users } from "../../database/schema/user.schema";

import { UserRole } from "../../common/enums/user-role.enum";

import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto";

const databaseSchema = {
  attendance,
  students,
  users,
};

export interface AttendanceResponse {
  id: string;

  studentId: string;

  student: {
    id: string;
    userId: string;
    name: string;
    email: string;
    admissionNumber: string;
    className: string;
    section: string;
    rollNumber: string;
  };

  date: string;

  status: AttendanceStatus;

  markedBy: {
    id: string;
    name: string;
    email: string;
  };

  remarks: string | null;

  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class AttendanceService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database:
      NodePgDatabase<
        typeof databaseSchema
      >,
  ) {}

  async create(
    createAttendanceDto:
      CreateAttendanceDto,

    markedByUserId: string,
  ): Promise<AttendanceResponse> {
    const [student] =
      await this.database
        .select({
          id: students.id,
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
              students.id,
              createAttendanceDto.studentId,
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
        "Student not found.",
      );
    }

    const [existingAttendance] =
      await this.database
        .select({
          id: attendance.id,
        })
        .from(attendance)
        .where(
          and(
            eq(
              attendance.studentId,
              createAttendanceDto.studentId,
            ),
            eq(
              attendance.date,
              createAttendanceDto.date,
            ),
          ),
        )
        .limit(1);

    if (existingAttendance) {
      throw new ConflictException(
        "Attendance has already been marked for this student on this date.",
      );
    }

    const [createdAttendance] =
      await this.database
        .insert(attendance)
        .values({
          studentId:
            createAttendanceDto.studentId,

          date:
            createAttendanceDto.date,

          status:
            createAttendanceDto.status,

          markedBy:
            markedByUserId,

          remarks:
            createAttendanceDto.remarks
              ?.trim() || null,
        })
        .returning({
          id: attendance.id,
        });

    if (!createdAttendance) {
      throw new Error(
        "Failed to create attendance record.",
      );
    }

    return this.findOne(
      createdAttendance.id,
    );
  }

  async findAll(): Promise<
    AttendanceResponse[]
  > {
    const records =
      await this.database
        .select({
          id: attendance.id,

          studentId:
            attendance.studentId,

          studentUserId:
            students.userId,

          studentName:
            users.name,

          studentEmail:
            users.email,

          admissionNumber:
            students.admissionNumber,

          className:
            students.className,

          section:
            students.section,

          rollNumber:
            students.rollNumber,

          date: attendance.date,

          status:
            attendance.status,

          markedById:
            attendance.markedBy,

          remarks:
            attendance.remarks,

          createdAt:
            attendance.createdAt,

          updatedAt:
            attendance.updatedAt,
        })
        .from(attendance)
        .innerJoin(
          students,
          eq(
            attendance.studentId,
            students.id,
          ),
        )
        .innerJoin(
          users,
          eq(
            students.userId,
            users.id,
          ),
        )
        .orderBy(
          desc(attendance.date),
          desc(attendance.createdAt),
        );

    return Promise.all(
      records.map(
        async (record) => {
          const markedBy =
            await this.getMarker(
              record.markedById,
            );

          return {
            id: record.id,

            studentId:
              record.studentId,

            student: {
              id:
                record.studentId,

              userId:
                record.studentUserId,

              name:
                record.studentName,

              email:
                record.studentEmail,

              admissionNumber:
                record.admissionNumber,

              className:
                record.className,

              section:
                record.section,

              rollNumber:
                record.rollNumber,
            },

            date: record.date,

            status:
              record.status,

            markedBy,

            remarks:
              record.remarks,

            createdAt:
              record.createdAt,

            updatedAt:
              record.updatedAt,
          };
        },
      ),
    );
  }

  async findOne(
    id: string,
  ): Promise<AttendanceResponse> {
    const [record] =
      await this.database
        .select({
          id: attendance.id,

          studentId:
            attendance.studentId,

          studentUserId:
            students.userId,

          studentName:
            users.name,

          studentEmail:
            users.email,

          admissionNumber:
            students.admissionNumber,

          className:
            students.className,

          section:
            students.section,

          rollNumber:
            students.rollNumber,

          date:
            attendance.date,

          status:
            attendance.status,

          markedById:
            attendance.markedBy,

          remarks:
            attendance.remarks,

          createdAt:
            attendance.createdAt,

          updatedAt:
            attendance.updatedAt,
        })
        .from(attendance)
        .innerJoin(
          students,
          eq(
            attendance.studentId,
            students.id,
          ),
        )
        .innerJoin(
          users,
          eq(
            students.userId,
            users.id,
          ),
        )
        .where(
          eq(
            attendance.id,
            id,
          ),
        )
        .limit(1);

    if (!record) {
      throw new NotFoundException(
        "Attendance record not found.",
      );
    }

    const markedBy =
      await this.getMarker(
        record.markedById,
      );

    return {
      id: record.id,

      studentId:
        record.studentId,

      student: {
        id:
          record.studentId,

        userId:
          record.studentUserId,

        name:
          record.studentName,

        email:
          record.studentEmail,

        admissionNumber:
          record.admissionNumber,

        className:
          record.className,

        section:
          record.section,

        rollNumber:
          record.rollNumber,
      },

      date: record.date,

      status:
        record.status,

      markedBy,

      remarks:
        record.remarks,

      createdAt:
        record.createdAt,

      updatedAt:
        record.updatedAt,
    };
  }

  async findMyAttendance(
    userId: string,
  ): Promise<
    AttendanceResponse[]
  > {
    const [student] =
      await this.database
        .select({
          id: students.id,
        })
        .from(students)
        .where(
          eq(
            students.userId,
            userId,
          ),
        )
        .limit(1);

    if (!student) {
      throw new NotFoundException(
        "Student profile not found.",
      );
    }

    const records =
      await this.findAll();

    return records.filter(
      (record) =>
        record.studentId ===
        student.id,
    );
  }

  async update(
    id: string,

    updateAttendanceDto:
      UpdateAttendanceDto,

    markedByUserId: string,
  ): Promise<AttendanceResponse> {
    await this.findOne(id);

    const updates: {
      status?: AttendanceStatus;
      remarks?: string | null;
      markedBy: string;
      updatedAt: Date;
    } = {
      markedBy:
        markedByUserId,

      updatedAt:
        new Date(),
    };

    if (
      updateAttendanceDto.status !==
      undefined
    ) {
      updates.status =
        updateAttendanceDto.status;
    }

    if (
      updateAttendanceDto.remarks !==
      undefined
    ) {
      updates.remarks =
        updateAttendanceDto.remarks
          .trim() || null;
    }

    await this.database
      .update(attendance)
      .set(updates)
      .where(
        eq(
          attendance.id,
          id,
        ),
      );

    return this.findOne(id);
  }

  private async getMarker(
    userId: string,
  ): Promise<{
    id: string;
    name: string;
    email: string;
  }> {
    const [marker] =
      await this.database
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
        })
        .from(users)
        .where(
          eq(
            users.id,
            userId,
          ),
        )
        .limit(1);

    if (!marker) {
      throw new NotFoundException(
        "Attendance marker not found.",
      );
    }

    return marker;
  }
}