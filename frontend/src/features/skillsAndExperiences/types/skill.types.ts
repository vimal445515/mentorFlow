export type ProficiencyLevel = "INTERMEDIATE" | "ADVANCED" | "EXPERT";

export interface SkillFormValues {
  skillName: string;
  proficiencyLevel: ProficiencyLevel;
  subtopics: string;
}

export interface SkillItem {
  id: string;
  name: string;
  description: string;
  level: ProficiencyLevel;
}

export interface MentorSkillRecord {
  skillId: string;
  mentorId: string;
  skillName: string;
  subtopics: string | null;
  proficiencyLevel: ProficiencyLevel;
}

export interface SkillsApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
