import { ProficiencyLevel } from "../../domain/enums/skillLevel.ts";
export interface AddSkillsDto {
  mentorId: string;
  skillName: string;
  subtopics?: string | null;
  proficiencyLevel: ProficiencyLevel;
}

export interface UpdateSkillsDto {
  skillId: string;
  mentorId: string;
  skillName?: string;
  subtopics?: string | null;
  proficiencyLevel?: ProficiencyLevel;
}
