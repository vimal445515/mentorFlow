import { z } from "zod";
import { EmploymentTypes, WorkPlaceTypes } from "../../domain/enums/experience.ts";

export const addExperienceSchema = z.object({
  title: z.string().trim().min(1),
  company: z.string().trim().nullable().optional(),
  employmentType: z.enum(EmploymentTypes),
  workPlaceType: z.enum(WorkPlaceTypes),
  location: z.string().trim().nullable().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
  isCurrent: z.boolean().optional(),
  description: z.string().trim().nullable().optional(),
});
