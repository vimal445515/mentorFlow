import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import type { IUserRepository } from "../../../auth/domain/repositories/IUserRepository.ts";
import type { IUpdateSkillUseCase} from "../../domain/interfaces/useCase/updateSkillUseCase.ts";
import type { ISkillsRepository } from "../../domain/repositories/ISkillsRepository.ts";
import type { UpdateSkillsDto } from "../dto/SkillsDto.ts";


export class updateSkillUseCase implements IUpdateSkillUseCase<UpdateSkillsDto>{
    constructor(
            private readonly skillsRepository:ISkillsRepository,
            private readonly userRepository:IUserRepository 
        ){}
    async execute(data: UpdateSkillsDto): Promise<{ message: string; }> {
        const  mentor = await this.userRepository.findById(data.mentorId);
        const skill = await  this.skillsRepository.findById(data.skillId);
        if(!mentor){
            throw new AppError("Mentor not found",HttpStatusCode.UNAUTHORIZED);
        }
        if(mentor.id !== skill?.mentorId ){
            throw new AppError("User can't access this data's",HttpStatusCode.BAD_REQUEST);
        }
        await  this.skillsRepository.update(data.skillId,data)

        return {message:"Skill updated successfully"};
    }

}