import { z } from "zod";
import { ProficiencyLevel } from "../../domain/enums/skillLevel.ts";

export const addSkillSchema = z.object({
  mentorId: z.string().min(1),
  skillName: z.string().trim().min(1),
  subtopics: z.string().nullable().optional(),
  proficiencyLevel: z.enum(ProficiencyLevel, {
    message: "Invalid proficiency Level ",
  }),
});

export type AddSkillInput = z.infer<typeof addSkillSchema>;
