export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "FREELANCE";

export type WorkPlaceType = "REMOTE" | "ONSITE" | "HYBRID";

export interface ExperienceFormValues {
  title: string;
  company: string;
  employmentType: EmploymentType;
  workPlaceType: WorkPlaceType;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export interface ExperienceRecord {
  experienceId: string;
  mentorId: string;
  title: string;
  company: string | null;
  employmentType: EmploymentType;
  workPlaceType: WorkPlaceType;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
