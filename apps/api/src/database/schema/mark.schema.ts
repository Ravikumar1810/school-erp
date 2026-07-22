import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { students } from "./student.schema";
import { users } from "./user.schema";

export const examTypeEnum = pgEnum(
  "exam_type",
  [
    "UNIT_TEST",
    "MID_TERM",
    "FINAL",
    "ASSIGNMENT",
  ],
);

export const marks = pgTable(
  "marks",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, {
        onDelete: "cascade",
      }),

    subject: varchar(
      "subject",
      {
        length: 100,
      },
    ).notNull(),

    examType:
      examTypeEnum(
        "exam_type",
      ).notNull(),

    marksObtained: integer(
      "marks_obtained",
    ).notNull(),

    maximumMarks: integer(
      "maximum_marks",
    ).notNull(),

    addedBy: uuid("added_by")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
      }),

    remarks: text("remarks"),

    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
      },
    )
      .defaultNow()
      .notNull(),

    updatedAt: timestamp(
      "updated_at",
      {
        withTimezone: true,
      },
    )
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex(
      "marks_student_subject_exam_unique",
    ).on(
      table.studentId,
      table.subject,
      table.examType,
    ),
  ],
);

export type Mark =
  typeof marks.$inferSelect;

export type NewMark =
  typeof marks.$inferInsert;

export type ExamType =
  (typeof examTypeEnum.enumValues)[number];