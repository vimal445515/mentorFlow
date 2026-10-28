import type {Request, Response} from "express";
import type { AuthenticatedRequest } from "../../../../app/middlewares/authMiddleware.ts";
import {HttpStatusCode} from "../../../../shared/constant/HttpStatusCode.ts";
import type { IAddSkillUseCase } from "../../domain/interfaces/useCase/addSkillUseCase.ts";
import type { IUpdateSkillUseCase } from "../../domain/interfaces/useCase/updateSkillUseCase.ts";
import type { IGetSkillsUseCase } from "../../domain/interfaces/useCase/getSkillsUseCase.ts";
import type { IDeleteSkillUseCase } from "../../domain/interfaces/useCase/deleteSkillUseCase.ts";
import type { AddSkillsDto, UpdateSkillsDto } from "../../application/dto/SkillsDto.ts";
import type { MentorSkill } from "../../domain/entities/skills.ts";
import { ResponseHandler } from "../../../../shared/response/responseHandler.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
export class SkillController {
    constructor(
        private addSkillUseCase:IAddSkillUseCase<AddSkillsDto>,
        private updateSkillUseCase:IUpdateSkillUseCase<UpdateSkillsDto>,
        private getSkillsUseCase:IGetSkillsUseCase<MentorSkill>,
        private deleteSkillUseCase: IDeleteSkillUseCase,
    ){}

    async createSkill(req:AuthenticatedRequest,res:Response):Promise<void>{
        const result = await this. addSkillUseCase.execute(req.body);
        ResponseHandler.success(res,result.message,null,HttpStatusCode.CREATED);
    }

    async updateSkill(req:Request,res:Response):Promise<void>{
        const result = await this.updateSkillUseCase.execute(req.body);
        ResponseHandler.success(res,result.message,null,HttpStatusCode.OK)
    }

    async getAllSkills(req:AuthenticatedRequest,res:Response):Promise<void>{
        const userId = req.user?.userId;
        if (!userId) {
            throw new AppError("Unauthorized", HttpStatusCode.UNAUTHORIZED);
        }

        const result = await this.getSkillsUseCase.execute(userId);
        ResponseHandler.success(
            res,
            "Skills fetched successfully",
            result,
            HttpStatusCode.OK,
        );
    }

    async deleteSkill(req:AuthenticatedRequest,res:Response):Promise<void>{
        const mentorId = req.user?.userId;
        if (!mentorId) {
            throw new AppError("Unauthorized", HttpStatusCode.UNAUTHORIZED);
        }

        const skillId = req.params.skillId;
        if (typeof skillId !== "string" || !skillId) {
            throw new AppError("Skill ID is required", HttpStatusCode.BAD_REQUEST);
        }

        const result = await this.deleteSkillUseCase.execute(mentorId, skillId);
        ResponseHandler.success(res, result.message, null, HttpStatusCode.OK);
    }
}