
import { z } from "zod";

export const envSchema = z.object({
  PORT: z.string(),

  DATABASE_URL: z.string(),

  JWT_SECRET: z.string(),

  JWT_EXPIRES_IN: z.string(),

  REFRESH_TOKEN_SECRET: z.string(),

  REFRESH_TOKEN_EXPIRES_IN: z.string(),
});

export function validate(config: Record<string, unknown>) {
  return envSchema.parse(config);
}