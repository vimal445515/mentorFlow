import type { UserListFiltersDto } from "../../application/dto/UserListFiltersDto.ts";
import type { MentorListFiltersDto } from "../../application/dto/MentorListFiltersDto.ts";
import type { ManagedMentor } from "../entities/ManagedMentor.ts";
import type { MentorDetails } from "../entities/MentorDetails.ts";
import type { ManagedUser } from "../entities/ManagedUser.ts";
import type { UserStatus } from "../enums/UserStatus.ts";

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export interface IUserManagementRepository {
  findUsers(filters: UserListFiltersDto): Promise<PaginatedResult<ManagedUser>>;
  findMentors(filters: MentorListFiltersDto): Promise<PaginatedResult<ManagedMentor>>;
  findMentorById(mentorId: string): Promise<MentorDetails | null>;
  approveMentor(mentorId: string): Promise<ManagedMentor | null>;
  rejectMentor(mentorId: string): Promise<ManagedMentor | null>;
  updateStatus(
    userId: string,
    status: Extract<UserStatus, "ACTIVE" | "SUSPENDED">,
  ): Promise<ManagedUser | null>;
}
