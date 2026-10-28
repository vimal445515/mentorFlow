import { z } from "zod";
import { ProficiencyLevel } from "../../domain/enums/skillLevel.ts";

export const updateSkillSchema = z
  .object({
    skillId: z.string().min(1),
    mentorId: z.string().min(1),
    skillName: z.string().trim().min(1).optional(),
    subtopics: z.string().nullable().optional(),
    proficiencyLevel: z.enum(ProficiencyLevel).optional(),
  })
  .refine(
    ({ skillName, subtopics, proficiencyLevel }) =>
      skillName !== undefined ||
      subtopics !== undefined ||
      proficiencyLevel !== undefined,
    {
      message: "Provide at least one skill field to update",
    },
  );

export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;