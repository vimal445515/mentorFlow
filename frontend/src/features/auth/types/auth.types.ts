export type Role = "STUDENT" | "MENTOR";
export type PortalRole = "STUDENT" | "MENTOR" | "ADMIN";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  status: string;
  role: "USER" | "MENTOR" | "ADMIN" | "STUDENT";
  profileImageUrl?: string;
}

export interface GoogleAuthDto {
  credential: string;
  role: Role;
}

export interface LoginDto {
  email: string;
  password: string;
  role?: PortalRole;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  role: Role;
}

export interface VerifySignupOtpDto {
  email: string;
  role: Role;
  otp: string;
}

export interface ResendSignupOtpDto {
  email: string;
  role: Role;
}

export interface SendForgotOtpDto {
  email: string;
  role?: PortalRole;
}

export interface VerifyForgotOtpDto {
  email: string;
  otp: string;
}

export interface ResendForgotOtpDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  resetToken: string;
  newPassword: string;
}

export interface VerifyForgotOtpResponse {
  resetToken: string;
}
