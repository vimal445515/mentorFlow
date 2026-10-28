import { api } from "@/core/api/axios";
import type {
  MentorSkillRecord,
  SkillFormValues,
  SkillsApiResponse,
} from "../types/skill.types";

export function createSkill(mentorId: string, values: SkillFormValues) {
  return api.post<SkillsApiResponse<null>>("/skills", {
    mentorId,
    skillName: values.skillName,
    proficiencyLevel: values.proficiencyLevel,
    subtopics: values.subtopics.trim() || null,
  });
}

export function updateSkill(
  skillId: string,
  mentorId: string,
  values: SkillFormValues,
) {
  return api.patch<SkillsApiResponse<null>>("/skills", {
    skillId,
    mentorId,
    skillName: values.skillName,
    proficiencyLevel: values.proficiencyLevel,
    subtopics: values.subtopics.trim() || null,
  });
}

export function deleteSkill(skillId: string) {
  return api.delete<SkillsApiResponse<null>>(
    `/skills/${encodeURIComponent(skillId)}`,
  );
}

export function getSkills() {
  return api.get<SkillsApiResponse<MentorSkillRecord[]>>("/skills");
}