import { z } from "zod";
import { UserRole } from "../../domain/enums/UserRole.ts";

export const sendForgotOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.nativeEnum(UserRole).optional(),
});

export const resendForgotOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const verifyForgotOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  resetToken: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters long"),
});
