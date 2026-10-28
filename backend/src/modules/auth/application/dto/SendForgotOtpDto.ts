import type { UserRole } from "../../domain/enums/UserRole.ts";

export interface SendForgotOtpDto {
  email: string;
  role?: UserRole;
}
