import type { UserRole } from "../../domain/enums/UserRole.ts";

export interface GoogleAuthDto {
  credential: string;
  role: UserRole;
}
