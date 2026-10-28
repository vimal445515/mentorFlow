import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import type { IUserRepository } from "../../../auth/domain/repositories/IUserRepository.ts";
import type { IGetSkillsUseCase } from "../../domain/interfaces/useCase/getSkillsUseCase.ts";
import type { ISkillsRepository } from "../../domain/repositories/ISkillsRepository.ts";
import type {MentorSkill} from "../../domain/entities/skills.ts"


export class getSkillsUseCase implements IGetSkillsUseCase<MentorSkill>{
     constructor(
            private readonly skillsRepository:ISkillsRepository,
            private readonly userRepository:IUserRepository 
        ){}

    async execute(id: string): Promise<MentorSkill[]> {
        const  mentor = await this.userRepository.findById(id);
        if(!mentor){
            throw new AppError("Mentor not found",HttpStatusCode.UNAUTHORIZED);
        }
        const skills = await this.skillsRepository.getAllSkillById(mentor.id!);
        return skills;
    }
}