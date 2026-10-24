import { z } from "zod";
import type { SignOptions } from "jsonwebtoken";

const appConfigSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z
    .enum(["trace", "debug", "info", "warn", "error", "fatal"])
    .default("info"),

  JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 characters"),

  JWT_EXPIRED_IN: z
    .string()
    .min(1, "JWT_EXPIRED_IN is required")
    .transform((value) => value as SignOptions["expiresIn"])
    .default("8h"),
  FRONTEND_URLS: z.string(),
});

export const appConfig = appConfigSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRED_IN: process.env.JWT_EXPIRED_IN,
  FRONTEND_URLS: process.env.FRONTEND_URLS,
});
