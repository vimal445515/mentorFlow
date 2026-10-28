import type { UserRole } from "../../domain/enums/UserRole.ts";
import type { UserStatus } from "../../domain/enums/UserStatus.ts";

export interface UserListFiltersDto {
  search?: string;
  role?: Exclude<UserRole, "ADMIN">;
  status?: UserStatus;
  year?: number;
  page: number;
  limit: number;
}
