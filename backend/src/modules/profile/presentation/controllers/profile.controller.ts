import type { Response } from "express";
import type { AuthenticatedRequest } from "../../../../app/middlewares/authMiddleware.ts";
import type { IGetProfileUseCase } from "../../domain/interfaces/userCase/IGetProfileUseCase.ts";
import type { IUpdateProfileUseCase } from "../../domain/interfaces/userCase/IUpdateProfileUseCase.ts";
import type { RequestMentorApprovalUseCase } from "../../application/useCase/RequestMentorApprovalUseCase.ts";
import { ResponseHandler } from "../../../../shared/response/responseHandler.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { AppError } from "../../../../shared/errors/appError.ts";

export class ProfileController {
  constructor(
    private readonly getProfileUseCase: IGetProfileUseCase,
    private readonly updateProfileUseCase: IUpdateProfileUseCase,
    private readonly requestMentorApprovalUseCase: RequestMentorApprovalUseCase,
  ) {}

  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized", HttpStatusCode.UNAUTHORIZED);
    }

    const profileData = await this.getProfileUseCase.execute(userId);
    ResponseHandler.success(res, "Profile fetched successfully", profileData, HttpStatusCode.OK);
  }

  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized", HttpStatusCode.UNAUTHORIZED);
    }

    const updatedProfile = await this.updateProfileUseCase.execute(userId, req.body);
    ResponseHandler.success(res, "Profile updated successfully", updatedProfile, HttpStatusCode.OK);
  }

  async requestMentorApproval(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized", HttpStatusCode.UNAUTHORIZED);
    }

    const profile = await this.requestMentorApprovalUseCase.execute(userId);
    ResponseHandler.success(
      res,
      "Mentor verification request submitted successfully.",
      profile,
      HttpStatusCode.OK,
    );
  }
}
