import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(5).max(50),
  password: z.string().min(8),
  fullName: z.string().min(3).max(255),
  email: z.string().email(),
});

export const loginSchema = z.object({
  username: z.string().min(5).max(50),
  password: z.string().min(8),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
