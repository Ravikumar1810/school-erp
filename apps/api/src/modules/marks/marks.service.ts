import {
  BadRequestException,
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

import { UserRole } from "../../common/enums/user-role.enum";

import { DATABASE_CONNECTION } from "../../database/database.constants";

import {
  marks,
  type ExamType,
} from "../../database/schema/mark.schema";

import { students } from "../../database/schema/student.schema";

import { users } from "../../database/schema/user.schema";

import { CreateMarkDto } from "./dto/create-mark.dto";
import { UpdateMarkDto } from "./dto/update-mark.dto";

const databaseSchema = {
  marks,
  students,
  users,
};

export interface MarkResponse {
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

  subject: string;

  examType: ExamType;

  marksObtained: number;

  maximumMarks: number;

  percentage: number;

  result:
    | "PASS"
    | "NEEDS_IMPROVEMENT";

  addedBy: {
    id: string;
    name: string;
    email: string;
  };

  remarks: string | null;

  createdAt: Date;

  updatedAt: Date;
}

interface RawMarkRecord {
  id: string;

  studentId: string;

  studentUserId: string;

  studentName: string;

  studentEmail: string;

  admissionNumber: string;

  className: string;

  section: string;

  rollNumber: string;

  subject: string;

  examType: ExamType;

  marksObtained: number;

  maximumMarks: number;

  addedById: string;

  remarks: string | null;

  createdAt: Date;

  updatedAt: Date;
}

@Injectable()
export class MarksService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database:
      NodePgDatabase<
        typeof databaseSchema
      >,
  ) {}

  async create(
    createMarkDto:
      CreateMarkDto,

    addedByUserId: string,
  ): Promise<MarkResponse> {
    if (
      createMarkDto.marksObtained >
      createMarkDto.maximumMarks
    ) {
      throw new BadRequestException(
        "Marks obtained cannot be greater than maximum marks.",
      );
    }

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
              createMarkDto.studentId,
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

    const subject =
      createMarkDto.subject.trim();

    const [existingMark] =
      await this.database
        .select({
          id: marks.id,
        })
        .from(marks)
        .where(
          and(
            eq(
              marks.studentId,
              createMarkDto.studentId,
            ),
            eq(
              marks.subject,
              subject,
            ),
            eq(
              marks.examType,
              createMarkDto.examType,
            ),
          ),
        )
        .limit(1);

    if (existingMark) {
      throw new ConflictException(
        "Marks already exist for this student, subject, and exam type. Please update the existing record.",
      );
    }

    const [createdMark] =
      await this.database
        .insert(marks)
        .values({
          studentId:
            createMarkDto.studentId,

          subject,

          examType:
            createMarkDto.examType,

          marksObtained:
            createMarkDto.marksObtained,

          maximumMarks:
            createMarkDto.maximumMarks,

          addedBy:
            addedByUserId,

          remarks:
            createMarkDto.remarks
              ?.trim() || null,
        })
        .returning({
          id: marks.id,
        });

    if (!createdMark) {
      throw new Error(
        "Failed to create marks record.",
      );
    }

    return this.findOne(
      createdMark.id,
    );
  }

  async findAll(): Promise<
    MarkResponse[]
  > {
    const records =
      await this.database
        .select({
          id: marks.id,

          studentId:
            marks.studentId,

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

          subject:
            marks.subject,

          examType:
            marks.examType,

          marksObtained:
            marks.marksObtained,

          maximumMarks:
            marks.maximumMarks,

          addedById:
            marks.addedBy,

          remarks:
            marks.remarks,

          createdAt:
            marks.createdAt,

          updatedAt:
            marks.updatedAt,
        })
        .from(marks)
        .innerJoin(
          students,
          eq(
            marks.studentId,
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
          desc(marks.createdAt),
        );

    return Promise.all(
      records.map(
        (record) =>
          this.buildResponse(
            record,
          ),
      ),
    );
  }

  async findOne(
    id: string,
  ): Promise<MarkResponse> {
    const [record] =
      await this.database
        .select({
          id: marks.id,

          studentId:
            marks.studentId,

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

          subject:
            marks.subject,

          examType:
            marks.examType,

          marksObtained:
            marks.marksObtained,

          maximumMarks:
            marks.maximumMarks,

          addedById:
            marks.addedBy,

          remarks:
            marks.remarks,

          createdAt:
            marks.createdAt,

          updatedAt:
            marks.updatedAt,
        })
        .from(marks)
        .innerJoin(
          students,
          eq(
            marks.studentId,
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
            marks.id,
            id,
          ),
        )
        .limit(1);

    if (!record) {
      throw new NotFoundException(
        "Marks record not found.",
      );
    }

    return this.buildResponse(
      record,
    );
  }

  async findMyMarks(
    userId: string,
  ): Promise<
    MarkResponse[]
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
      await this.database
        .select({
          id: marks.id,

          studentId:
            marks.studentId,

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

          subject:
            marks.subject,

          examType:
            marks.examType,

          marksObtained:
            marks.marksObtained,

          maximumMarks:
            marks.maximumMarks,

          addedById:
            marks.addedBy,

          remarks:
            marks.remarks,

          createdAt:
            marks.createdAt,

          updatedAt:
            marks.updatedAt,
        })
        .from(marks)
        .innerJoin(
          students,
          eq(
            marks.studentId,
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
            marks.studentId,
            student.id,
          ),
        )
        .orderBy(
          desc(marks.createdAt),
        );

    return Promise.all(
      records.map(
        (record) =>
          this.buildResponse(
            record,
          ),
      ),
    );
  }

  async update(
    id: string,

    updateMarkDto:
      UpdateMarkDto,

    addedByUserId: string,
  ): Promise<MarkResponse> {
    const existingMark =
      await this.findOne(id);

    const marksObtained =
      updateMarkDto.marksObtained ??
      existingMark.marksObtained;

    const maximumMarks =
      updateMarkDto.maximumMarks ??
      existingMark.maximumMarks;

    if (
      marksObtained >
      maximumMarks
    ) {
      throw new BadRequestException(
        "Marks obtained cannot be greater than maximum marks.",
      );
    }

    const updates: {
      marksObtained?: number;
      maximumMarks?: number;
      remarks?: string | null;
      addedBy: string;
      updatedAt: Date;
    } = {
      addedBy:
        addedByUserId,

      updatedAt:
        new Date(),
    };

    if (
      updateMarkDto.marksObtained !==
      undefined
    ) {
      updates.marksObtained =
        updateMarkDto.marksObtained;
    }

    if (
      updateMarkDto.maximumMarks !==
      undefined
    ) {
      updates.maximumMarks =
        updateMarkDto.maximumMarks;
    }

    if (
      updateMarkDto.remarks !==
      undefined
    ) {
      updates.remarks =
        updateMarkDto.remarks
          .trim() || null;
    }

    await this.database
      .update(marks)
      .set(updates)
      .where(
        eq(
          marks.id,
          id,
        ),
      );

    return this.findOne(id);
  }

  private async buildResponse(
    record: RawMarkRecord,
  ): Promise<MarkResponse> {
    const addedBy =
      await this.getAddedBy(
        record.addedById,
      );

    const percentage =
      record.maximumMarks > 0
        ? Number(
            (
              (record.marksObtained /
                record.maximumMarks) *
              100
            ).toFixed(2),
          )
        : 0;

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

      subject:
        record.subject,

      examType:
        record.examType,

      marksObtained:
        record.marksObtained,

      maximumMarks:
        record.maximumMarks,

      percentage,

      result:
        percentage >= 40
          ? "PASS"
          : "NEEDS_IMPROVEMENT",

      addedBy,

      remarks:
        record.remarks,

      createdAt:
        record.createdAt,

      updatedAt:
        record.updatedAt,
    };
  }

  private async getAddedBy(
    userId: string,
  ): Promise<{
    id: string;
    name: string;
    email: string;
  }> {
    const [user] =
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

    if (!user) {
      throw new NotFoundException(
        "Marks creator not found.",
      );
    }

    return user;
  }
}