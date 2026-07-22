import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL environment variable is not defined.",
  );
}

const connection = postgres(databaseUrl, {
  prepare: false,
});

export const db = drizzle(connection);