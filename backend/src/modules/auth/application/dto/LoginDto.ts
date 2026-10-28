import { UserRole } from "../../domain/enums/UserRole.ts";
export interface LoginDto {
  email: string;
  password: string;
  role: UserRole;
}
