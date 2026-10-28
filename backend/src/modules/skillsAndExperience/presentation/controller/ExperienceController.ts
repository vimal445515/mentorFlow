import type { Response } from "express";
import type { AuthenticatedRequest } from "../../../../app/middlewares/authMiddleware.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { ResponseHandler } from "../../../../shared/response/responseHandler.ts";
import type { IAddExperienceUseCase } from "../../domain/interfaces/useCase/addExperienceUseCase.ts";
import type { IDeleteExperienceUseCase } from "../../domain/interfaces/useCase/deleteExperienceUseCase.ts";
import type { IGetExperiencesUseCase } from "../../domain/interfaces/useCase/getExperiencesUseCase.ts";
import type { IUpdateExperienceUseCase } from "../../domain/interfaces/useCase/updateExperienceUseCase.ts";
import type { AddExperienceDto, UpdateExperienceDto } from "../../application/dto/ExperienceDto.ts";

export class ExperienceController {
  constructor(
    private readonly addExperienceUseCase: IAddExperienceUseCase,
    private readonly getExperiencesUseCase: IGetExperiencesUseCase,
    private readonly updateExperienceUseCase: IUpdateExperienceUseCase,
    private readonly deleteExperienceUseCase: IDeleteExperienceUseCase,
  ) {}

  async create(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    const mentorId = req.user?.userId;
    if (!mentorId) {
      throw new AppError("Unauthorized", HttpStatusCode.UNAUTHORIZED);
    }

    const result = await this.addExperienceUseCase.execute(
      mentorId,
      req.body as AddExperienceDto,
    );
    ResponseHandler.success(
      res,
      result.message,
      null,
      HttpStatusCode.CREATED,
    );
  }

  async getAll(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    const mentorId = req.user?.userId;
    if (!mentorId) {
      throw new AppError("Unauthorized", HttpStatusCode.UNAUTHORIZED);
    }

    const experiences = await this.getExperiencesUseCase.execute(mentorId);
    ResponseHandler.success(
      res,
      "Experiences fetched successfully",
      experiences,
      HttpStatusCode.OK,
    );
  }

  async update(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    const mentorId = req.user?.userId;
    if (!mentorId) {
      throw new AppError("Unauthorized", HttpStatusCode.UNAUTHORIZED);
    }
    const experienceId = req.params.experienceId;
    if (typeof experienceId !== "string" || !experienceId) {
      throw new AppError("Experience ID is required", HttpStatusCode.BAD_REQUEST);
    }

    const result = await this.updateExperienceUseCase.execute(
      mentorId,
      experienceId,
      req.body as UpdateExperienceDto,
    );
    ResponseHandler.success(
      res,
      result.message,
      null,
      HttpStatusCode.OK,
    );
  }

  async delete(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    const mentorId = req.user?.userId;
    if (!mentorId) {
      throw new AppError("Unauthorized", HttpStatusCode.UNAUTHORIZED);
    }
    const experienceId = req.params.experienceId;
    if (typeof experienceId !== "string" || !experienceId) {
      throw new AppError("Experience ID is required", HttpStatusCode.BAD_REQUEST);
    }

    const result = await this.deleteExperienceUseCase.execute(
      mentorId,
      experienceId,
    );
    ResponseHandler.success(
      res,
      result.message,
      null,
      HttpStatusCode.OK,
    );
  }
}
