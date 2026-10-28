import { z } from "zod";
import { UserRole } from "../../domain/enums/UserRole.ts";

export const studentLoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "password must be at least 6 characters"),
  role: z.literal(UserRole.STUDENT),
});

export const mentorLoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "password must be at least 6 characters"),
  role: z.literal(UserRole.MENTOR),
});

export const AdminLoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "password must be at least 6 characters"),
  role: z.literal(UserRole.ADMIN),
});
