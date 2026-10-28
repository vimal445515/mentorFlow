import type { ProficiencyLevel } from "../enums/skillLevel.ts";

export interface MentorSkillProps {
  skillId?: string;
  mentorId: string;
  skillName: string;
  subtopics?: string | null;
  proficiencyLevel: ProficiencyLevel;
}

export class MentorSkill {
  public readonly skillId?: string;
  public readonly mentorId: string;
  public skillName: string;
  public subtopics: string | null;
  public proficiencyLevel: ProficiencyLevel;

  constructor(props: MentorSkillProps) {
    this.skillId = props.skillId;
    this.mentorId = props.mentorId;
    this.skillName = props.skillName;
    this.subtopics = props.subtopics ?? null;
    this.proficiencyLevel = props.proficiencyLevel;
  }
}
