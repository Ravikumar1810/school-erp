import {
  date,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { users } from "./user.schema";

export const students = pgTable(
  "students",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    admissionNumber: varchar(
      "admission_number",
      {
        length: 50,
      },
    )
      .notNull()
      .unique(),

    className: varchar(
      "class_name",
      {
        length: 50,
      },
    ).notNull(),

    section: varchar(
      "section",
      {
        length: 20,
      },
    ).notNull(),

    rollNumber: varchar(
      "roll_number",
      {
        length: 50,
      },
    ).notNull(),

    dateOfBirth: date(
      "date_of_birth",
      {
        mode: "string" ,
      },
    ),

    parentName: varchar(
      "parent_name",
      {
        length: 150,
      },
    ),

    parentPhone: varchar(
      "parent_phone",
      {
        length: 20,
      },
    ),

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
);

export type Student =
  typeof students.$inferSelect;

export type NewStudent =
  typeof students.$inferInsert;