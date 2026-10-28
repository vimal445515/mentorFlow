import { api } from "@/core/api/axios";
import type {
  ApiResponse,
  ExperienceFormValues,
  ExperienceRecord,
} from "../types/experience.types";

export function getExperiences() {
  return api.get<ApiResponse<ExperienceRecord[]>>("/skills/experiences");
}

export function createExperience(values: ExperienceFormValues) {
  return api.post<ApiResponse<null>>("/skills/experiences", {
    title: values.title,
    company: values.company.trim() || null,
    employmentType: values.employmentType,
    workPlaceType: values.workPlaceType,
    location: values.location.trim() || null,
    startDate: values.startDate,
    endDate: values.isCurrent ? null : values.endDate || null,
    isCurrent: values.isCurrent,
    description: values.description.trim() || null,
  });
}

export function updateExperience(
  experienceId: string,
  values: ExperienceFormValues,
) {
  return api.patch<ApiResponse<null>>(
    `/skills/experiences/${encodeURIComponent(experienceId)}`,
    {
      title: values.title,
      company: values.company.trim() || null,
      employmentType: values.employmentType,
      workPlaceType: values.workPlaceType,
      location: values.location.trim() || null,
      startDate: values.startDate,
      endDate: values.isCurrent ? null : values.endDate || null,
      isCurrent: values.isCurrent,
      description: values.description.trim() || null,
    },
  );
}

export function deleteExperience(experienceId: string) {
  return api.delete<ApiResponse<null>>(
    `/skills/experiences/${encodeURIComponent(experienceId)}`,
  );
}
