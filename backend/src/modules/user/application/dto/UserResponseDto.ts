import type { UserRole } from "../../domain/enums/UserRole.ts";
import type { UserStatus } from "../../domain/enums/UserStatus.ts";
import type { EmploymentType } from "../../domain/enums/EmploymentType.ts";
import type { ProficiencyLevel } from "../../domain/enums/ProficiencyLevel.ts";
import type { WorkPlaceType } from "../../domain/enums/WorkPlaceType.ts";

export interface MentorSkillResponseDto {
  skillId: string;
  skillName: string;
  subtopics: string | null;
  proficiencyLevel: ProficiencyLevel;
}

export interface MentorExperienceResponseDto {
  experienceId: string;
  title: string;
  company: string | null;
  employmentType: EmploymentType;
  workPlaceType: WorkPlaceType;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  description: string | null;
}

export interface UserResponseDto {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  profileImageUrl: string | null;
}

export interface PaginatedUsersResponseDto {
  users: UserResponseDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MentorResponseDto {
  id: string;
  fullName: string;
  email: string;
  profileImageUrl: string | null;
  status: UserStatus;
  createdAt: Date;
  headline: string | null;
  sessionPrice: number;
  yearsExperience: number;
  teachingSubjects: string | null;
  verificationStatus: UserStatus;
  skills: string[];
  latestExperience: string | null;
}

export interface MentorDetailsResponseDto extends Omit<MentorResponseDto, "skills"> {
  bio: string | null;
  followerCount: number;
  averageRating: number;
  timezone: string | null;
  approvedAt: Date | null;
  skills: MentorSkillResponseDto[];
  experiences: MentorExperienceResponseDto[];
}

export interface PaginatedMentorsResponseDto {
  mentors: MentorResponseDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
