import {
  boolean,
  index,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { UserRole } from "../../common/enums/user-role.enum";

export const userRoleEnum = pgEnum(
  "user_role",
  [
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.STUDENT,
  ],
);

export const users = pgTable(
  "users",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    name: varchar("name", {
      length: 100,
    }).notNull(),

    email: varchar("email", {
      length: 255,
    })
      .notNull()
      .unique(),

    password: varchar("password", {
      length: 255,
    }).notNull(),

    role: userRoleEnum("role")
      .notNull()
      .default(UserRole.STUDENT),

    phone: varchar("phone", {
      length: 20,
    }),

    avatar: varchar("avatar", {
      length: 500,
    }),

    isActive: boolean("is_active")
      .notNull()
      .default(true),

    refreshToken: varchar(
      "refresh_token",
      {
        length: 500,
      },
    ),

    /**
     * Stores SHA-256 hash only.
     * Never store the raw password reset token.
     */
    passwordResetToken: varchar(
      "password_reset_token",
      {
        length: 500,
      },
    ),

    passwordResetExpiresAt: timestamp(
      "password_reset_expires_at",
      {
        withTimezone: true,
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
  (table) => [
    index(
      "users_email_idx",
    ).on(table.email),

    index(
      "users_role_idx",
    ).on(table.role),
  ],
);

export type User =
  typeof users.$inferSelect;

export type NewUser =
  typeof users.$inferInsert;