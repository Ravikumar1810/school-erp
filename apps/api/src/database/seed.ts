import "dotenv/config";

import * as bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { UserRole } from "../common/enums/user-role.enum";
import { db } from "./drizzle/drizzle";
import { users } from "./schema/user.schema";

async function seed(): Promise<void> {
  console.log("Starting database seed...");

  const email = "principal@schoolerp.com";
  const password = "Password123";

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser) {
    console.log(`Super Admin already exists: ${email}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const [superAdmin] = await db
    .insert(users)
    .values({
      name: "School Principal",
      email,
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    });

  console.log("Super Admin created successfully.");
  console.log(superAdmin);
  console.log(`Login email: ${email}`);
  console.log(`Login password: ${password}`);
}

seed()
  .then(() => {
    console.log("Database seed completed.");
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error("Database seed failed:", error);
    process.exit(1);
  });