import { z } from "zod";
import { EmploymentTypes, WorkPlaceTypes } from "../../domain/enums/experience.ts";

export const updateExperienceSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    company: z.string().trim().nullable().optional(),
    employmentType: z.enum(EmploymentTypes).optional(),
    workPlaceType: z.enum(WorkPlaceTypes).optional(),
    location: z.string().trim().nullable().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().nullable().optional(),
    isCurrent: z.boolean().optional(),
    description: z.string().trim().nullable().optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: "Provide at least one experience field to update" },
  );
