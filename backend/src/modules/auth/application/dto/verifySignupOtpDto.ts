import type { UserRole } from "../../domain/enums/UserRole.ts";

export interface VerifySignupOtpDto {
  email: string;
  role: UserRole;
  otp: string;
}
