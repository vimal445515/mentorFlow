import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import type { IUserRepository } from "../../../auth/domain/repositories/IUserRepository.ts";
import type { MentorSkill } from "../../domain/entities/skills.ts";
import type { IAddSkillUseCase } from "../../domain/interfaces/useCase/addSkillUseCase.ts";
import type { ISkillsRepository } from "../../domain/repositories/ISkillsRepository.ts";
import type { AddSkillsDto } from "../dto/SkillsDto.ts";

export class addSkillUseCase implements IAddSkillUseCase<AddSkillsDto>{
    constructor(
        private readonly skillsRepository:ISkillsRepository,
        private readonly userRepository:IUserRepository 
    ){}

    async execute(data: AddSkillsDto): Promise<{ message: string; }> {
        const  mentor = await this.userRepository.findById(data.mentorId);
        if(!mentor){
            throw new AppError("Mentor not found",HttpStatusCode.UNAUTHORIZED);
        }
        const  addedSkill = await this.skillsRepository.create(data as MentorSkill);
        return {message:"Skill created successfully"}
    }

}