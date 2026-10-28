import type { UserRole } from "../../domain/enums/UserRole.ts";

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  role?:UserRole;
}