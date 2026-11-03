import {
  ProficiencyLevel as PrismaProficiencyLevel,
  type Prisma,
  type mentorSkill as PrismaMentorSkill,
} from "@prisma/client";
import { MentorSkill } from "../../domain/entities/skills.ts";
import { ProficiencyLevel } from "../../domain/enums/skillLevel.ts";
import { prisma } from "../persistence/prisma.ts";

export class SkillsMapper {
  static toDb(skill: MentorSkill): Prisma.mentorSkillUncheckedCreateInput {
    return {
      mentorId: skill.mentorId,
      skillName: skill.skillName,
      subtopics: skill.subtopics,
      proficiencyLevel: skill.proficiencyLevel as PrismaProficiencyLevel,
    };
  }

  static toUpdateDb(
    skill: Partial<MentorSkill>,
  ): Prisma.mentorSkillUncheckedUpdateInput {
    return {
      ...(skill.mentorId !== undefined && { mentorId: skill.mentorId }),
      ...(skill.skillName !== undefined && { skillName: skill.skillName }),
      ...(skill.subtopics !== undefined && { subtopics: skill.subtopics }),
      ...(skill.proficiencyLevel !== undefined && {
        proficiencyLevel: skill.proficiencyLevel as PrismaProficiencyLevel,
      }),
    };
  }

  static fromDb(prismaSkill: PrismaMentorSkill): MentorSkill {
    return new MentorSkill({
      skillId: prismaSkill.skillId,
      mentorId: prismaSkill.mentorId,
      skillName: prismaSkill.skillName,
      subtopics: prismaSkill.subtopics,
      proficiencyLevel: prismaSkill.proficiencyLevel as ProficiencyLevel,
    });
  }

}
