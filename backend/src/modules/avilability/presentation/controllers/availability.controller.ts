import type { Response } from "express";
import type { AuthenticatedRequest } from "../../../../app/middlewares/authMiddleware.ts";
import type { ICreateAvailabilityUseCase } from "../../domain/interfaces/useCase/ICreateAvailabilityUseCase.ts";
import type { IGetAvailabilityUseCase } from "../../domain/interfaces/useCase/IGetAvailabilityUseCase.ts";
import type { IDeleteAvailabilityUseCase } from "../../domain/interfaces/useCase/IDeleteAvailabilityUseCase.ts";
import { ResponseHandler } from "../../../../shared/response/responseHandler.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { AppError } from "../../../../shared/errors/appError.ts";

export class AvailabilityController {
  constructor(
    private readonly createAvailabilityUseCase: ICreateAvailabilityUseCase,
    private readonly getAvailabilityUseCase: IGetAvailabilityUseCase,
    private readonly deleteAvailabilityUseCase: IDeleteAvailabilityUseCase,
  ) {}

  async getSlots(req: AuthenticatedRequest, res: Response): Promise<void> {
    const mentorId = this.getMentorId(req);
    const slots = await this.getAvailabilityUseCase.execute(mentorId);
    ResponseHandler.success(res, "Availability fetched successfully", slots);
  }

  async createSlot(req: AuthenticatedRequest, res: Response): Promise<void> {
    const mentorId = this.getMentorId(req);
    const slot = await this.createAvailabilityUseCase.execute(
      mentorId,
      req.body,
    );
    ResponseHandler.success(
      res,
      "Availability slot created successfully",
      slot,
      HttpStatusCode.CREATED,
    );
  }

  async deleteSlot(req: AuthenticatedRequest, res: Response): Promise<void> {
    const mentorId = this.getMentorId(req);
    const slotId = Array.isArray(req.params.slotId)
      ? req.params.slotId[0]
      : req.params.slotId;
    if (!slotId) {
      throw new AppError("Availability slot ID is required", HttpStatusCode.BAD_REQUEST);
    }

    await this.deleteAvailabilityUseCase.execute(mentorId, slotId);
    ResponseHandler.success(res, "Availability slot deleted successfully", null);
  }

  private getMentorId(req: AuthenticatedRequest): string {
    if (!req.user?.userId) {
      throw new AppError("Unauthorized", HttpStatusCode.UNAUTHORIZED);
    }
    if (req.user.role !== "MENTOR") {
      throw new AppError("Only mentors can manage availability", HttpStatusCode.FORBIDDEN);
    }
    return req.user.userId;
  }
}
