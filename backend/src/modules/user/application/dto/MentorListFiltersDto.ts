import type { UserStatus } from "../../domain/enums/UserStatus.ts";

export interface MentorListFiltersDto {
  search?: string;
  status?: UserStatus;
  verificationStatus?: UserStatus;
  page: number;
  limit: number;
}
