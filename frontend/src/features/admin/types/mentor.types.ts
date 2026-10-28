import type { ManagedUserStatus } from "./user.types";

export interface ManagedMentor {
  id: string;
  fullName: string;
  email: string;
  profileImageUrl: string | null;
  status: ManagedUserStatus;
  createdAt: string;
  headline: string | null;
  sessionPrice: number;
  yearsExperience: number;
  teachingSubjects: string | null;
  verificationStatus: ManagedUserStatus;
  skills: string[];
  latestExperience: string | null;
}

export interface MentorListParams {
  search?: string;
  status?: ManagedUserStatus;
  verificationStatus?: ManagedUserStatus;
  page: number;
  limit: number;
}

export interface PaginatedMentors {
  mentors: ManagedMentor[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MentorSkillDetail {
  skillId: string;
  skillName: string;
  subtopics: string | null;
  proficiencyLevel: "ADVANCED" | "INTERMEDIATE" | "EXPERT";
}

export interface MentorExperienceDetail {
  experienceId: string;
  title: string;
  company: string | null;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "FREELANCE";
  workPlaceType: "REMOTE" | "ONSITE" | "HYBRID";
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
}

export interface MentorDetails extends Omit<ManagedMentor, "skills"> {
  bio: string | null;
  followerCount: number;
  averageRating: number;
  timezone: string | null;
  approvedAt: string | null;
  skills: MentorSkillDetail[];
  experiences: MentorExperienceDetail[];
}
