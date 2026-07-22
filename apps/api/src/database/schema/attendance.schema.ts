import {
  date,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { students } from "./student.schema";
import { users } from "./user.schema";

export const attendanceStatusEnum = pgEnum(
  "attendance_status",
  [
    "PRESENT",
    "ABSENT",
    "LEAVE",
  ],
);

export const attendance = pgTable(
  "attendance",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, {
        onDelete: "cascade",
      }),

    date: date("date", {
      mode: "string",
    }).notNull(),

    status:
      attendanceStatusEnum(
        "status",
      ).notNull(),

    markedBy: uuid("marked_by")
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
      "attendance_student_date_unique",
    ).on(
      table.studentId,
      table.date,
    ),
  ],
);

export type Attendance =
  typeof attendance.$inferSelect;

export type NewAttendance =
  typeof attendance.$inferInsert;

export type AttendanceStatus =
  (typeof attendanceStatusEnum.enumValues)[number];