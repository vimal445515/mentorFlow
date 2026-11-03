import { injectable } from "inversify";
import {prisma} from '../persistence/prisma.ts'
import { MentorSkill } from "../../domain/entities/skills.ts";
import type { ISkillsRepository } from "../../domain/repositories/ISkillsRepository.ts";
import { SkillsMapper } from "../mappers/skillsMapper.ts";
import type { Prisma, mentorSkill } from "@prisma/client";
import { BaseRepository } from "../../../../shared/base/repositories/baseRepository.ts";
@injectable()
export class PrismaSkillRepository
    extends BaseRepository<
        MentorSkill,
        mentorSkill,
        Prisma.mentorSkillUncheckedCreateInput,
        Prisma.mentorSkillUncheckedUpdateInput
    >
    implements ISkillsRepository {
    constructor() {
        super(prisma.mentorSkill, SkillsMapper, "skillId");
    }

    async getAllSkillById(mentorId: string): Promise<MentorSkill[]> {
        const skills = await prisma.mentorSkill.findMany({
            where:{mentorId:mentorId},
        });

        return skills.map(SkillsMapper.fromDb);
    }

  
}