import type { Response } from "express";
import type { AuthenticatedRequest } from "../../../../app/middlewares/authMiddleware.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { ResponseHandler } from "../../../../shared/response/responseHandler.ts";
import type { CreateAvailabilitySlotInput } from "../../infrastructure/repositories/PrismaAvailabilityRepository.ts";
import { PrismaAvailabilityRepository } from "../../infrastructure/repositories/PrismaAvailabilityRepository.ts";

export class AvailabilityController {
  constructor(
    private readonly availabilityRepository: PrismaAvailabilityRepository,
  ) {}

  private getMentorId(req: AuthenticatedRequest): string {
    if (!req.user?.userId) {
      throw new AppError("Unauthorized", HttpStatusCode.UNAUTHORIZED);
    }
    if (req.user.role !== "MENTOR") {
      throw new AppError("Only mentors can manage availability.", HttpStatusCode.FORBIDDEN);
    }
    return req.user.userId;
  }

  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    const mentorId = this.getMentorId(req);
    const slots = await this.availabilityRepository.getForMentor(mentorId);
    ResponseHandler.success(
      res,
      "Availability fetched successfully",
      slots.map((slot) => ({
        slotId: slot.slotId,
        date: slot.date.toISOString().slice(0, 10),
        startTime: slot.startTime,
        endTime: slot.endTime,
      })),
      HttpStatusCode.OK,
    );
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    const mentorId = this.getMentorId(req);
    const { date, startTime, endTime } = req.body as {
      date: string;
      startTime: string;
      endTime: string;
    };

    try {
      const slot = await this.availabilityRepository.create({
        mentorId,
        date: new Date(`${date}T00:00:00.000Z`),
        startTime,
        endTime,
      } satisfies CreateAvailabilitySlotInput);
      ResponseHandler.success(
        res,
        "Availability slot added successfully",
        {
          slotId: slot.slotId,
          date: slot.date.toISOString().slice(0, 10),
          startTime: slot.startTime,
          endTime: slot.endTime,
        },
        HttpStatusCode.CREATED,
      );
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
      ) {
        throw new AppError(
          "This availability slot already exists.",
          HttpStatusCode.CONFLICT,
        );
      }
      throw error;
    }
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    const mentorId = this.getMentorId(req);
    const slotId = req.params.slotId;
    if (typeof slotId !== "string" || !slotId) {
      throw new AppError("Slot ID is required", HttpStatusCode.BAD_REQUEST);
    }

    const deleted = await this.availabilityRepository.deleteForMentor(mentorId, slotId);
    if (!deleted) {
      throw new AppError("Availability slot not found.", HttpStatusCode.NOT_FOUND);
    }

    ResponseHandler.success(
      res,
      "Availability slot removed successfully",
      null,
      HttpStatusCode.OK,
    );
  }
}
