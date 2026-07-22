import { Inject, Injectable } from "@nestjs/common";
import { eq, and, gt } from "drizzle-orm";

import { DATABASE_CONNECTION } from "../../database/database.constants";
import { db } from "../../database/drizzle/drizzle";
import {
  type NewUser,
  type User,
  users,
} from "../../database/schema/user.schema";


@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: typeof db,
  ) {}


  async findById(id: string): Promise<User | undefined> {
    const [user] = await this.database
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const normalizedEmail = email.trim().toLowerCase();

    const [user] = await this.database
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    return user;
  }

  async create(data: NewUser): Promise<User> {
    const [user] = await this.database
      .insert(users)
      .values({
        ...data,
        email: data.email.trim().toLowerCase(),
      })
      .returning();

    return user;
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.database
      .update(users)
      .set({
        refreshToken,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

    async updatePasswordResetToken(
    userId: string,
    hashedToken: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.database
      .update(users)
      .set({
        passwordResetToken:
          hashedToken,

        passwordResetExpiresAt:
          expiresAt,

        updatedAt:
          new Date(),
      })
      .where(
        eq(
          users.id,
          userId,
        ),
      );
  }

  async findByValidPasswordResetToken(
    hashedToken: string,
  ) {
    const [user] =
      await this.database
        .select()
        .from(users)
        .where(
          and(
            eq(
              users.passwordResetToken,
              hashedToken,
            ),

            gt(
              users.passwordResetExpiresAt,
              new Date(),
            ),
          ),
        )
        .limit(1);

    return user ?? null;
  }

  async resetPassword(
    userId: string,
    hashedPassword: string,
  ): Promise<void> {
    await this.database
      .update(users)
      .set({
        password:
          hashedPassword,

        passwordResetToken:
          null,

        passwordResetExpiresAt:
          null,

        // Invalidate existing login sessions.
        refreshToken:
          null,

        updatedAt:
          new Date(),
      })
      .where(
        eq(
          users.id,
          userId,
        ),
      );
  }

  async updatePassword(
    userId: string,
    hashedPassword: string,
  ): Promise<void> {
    await this.database
      .update(users)
      .set({
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiresAt: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async clearRefreshToken(userId: string): Promise<void> {
    await this.database
      .update(users)
      .set({
        refreshToken: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }
}