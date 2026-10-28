import type { IBaseRepository } from "../../../../shared/base/repositories/IBaseRepository.ts";
import type { MentorSkill } from "../entities/skills.ts";
export interface ISkillsRepository extends IBaseRepository<MentorSkill>{
    getAllSkillById(mentorId:string):Promise<MentorSkill[]>;
}