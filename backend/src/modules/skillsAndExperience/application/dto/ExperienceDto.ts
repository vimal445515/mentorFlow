import type {
  EmploymentTypes,
  WorkPlaceTypes,
} from "../../domain/enums/experience.ts";

export interface AddExperienceDto {
  title: string;
  company?: string | null;
  employmentType: EmploymentTypes;
  workPlaceType: WorkPlaceTypes;
  location?: string | null;
  startDate: Date;
  endDate?: Date | null;
  isCurrent?: boolean;
  description?: string | null;
}

export interface UpdateExperienceDto {
  title?: string;
  company?: string | null;
  employmentType?: EmploymentTypes;
  workPlaceType?: WorkPlaceTypes;
  location?: string | null;
  startDate?: Date;
  endDate?: Date | null;
  isCurrent?: boolean;
  description?: string | null;
}
