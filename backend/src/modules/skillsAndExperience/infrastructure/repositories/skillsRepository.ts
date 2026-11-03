import { injectable } from "inversify";
import {prisma} from '../persistence/prisma.ts'
import { MentorSkill } from "../../domain/entities/skills.ts";
import type { ISkillsRepository } from "../../domain/repositories/ISkillsRepository.ts";
import { SkillsMapper } from "../mappers/skillsMapper.ts";
import type { mentorSkill } from "@prisma/client";
@injectable()
export class PrismaSkillRepository implements ISkillsRepository{

    async create(data: MentorSkill): Promise<MentorSkill> {
        const createdSkill = await prisma.mentorSkill.create({data:SkillsMapper.toDb(data)})
        return SkillsMapper.fromDb(createdSkill);
    }

    async update(id: string, data: Partial<MentorSkill>): Promise<MentorSkill> {
        const updatedSkills = await prisma.mentorSkill.update({
                where:{skillId:id},
                data:SkillsMapper.toUpdateDb(data)
        })

        return SkillsMapper.fromDb(updatedSkills);
    }

    async findById(id: string): Promise<MentorSkill | null> {
        const skill = await prisma.mentorSkill.findUnique({
            where:{skillId:id}
        })
        return skill ? SkillsMapper.fromDb(skill):null;
    }

    async findAll(): Promise<MentorSkill[]> {
        const skills = await prisma.mentorSkill.findMany();
        return skills.map(SkillsMapper.fromDb);
    }

    async delete(id: string): Promise<void> {
        await prisma.mentorSkill.delete({
            where:{skillId:id}
        })
    }

    async getAllSkillById(mentorId: string): Promise<MentorSkill[]> {
        const skills = await prisma.mentorSkill.findMany({
            where:{mentorId:mentorId},
        });

        return SkillsMapper.arrayFromDb(skills);
    }

  
}