import type { Response } from "express";
import type { AuthenticatedRequest } from "../../../../app/middlewares/authMiddleware.ts";
import { z } from "zod";
import { ResponseHandler } from "../../../../shared/response/responseHandler.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import type { IListUsersUseCase } from "../../domain/interfaces/useCase/IListUsersUseCase.ts";
import type { IUpdateUserStatusUseCase } from "../../domain/interfaces/useCase/IUpdateUserStatusUseCase.ts";
import type { IListMentorsUseCase } from "../../domain/interfaces/useCase/IListMentorsUseCase.ts";
import type { IApproveMentorUseCase } from "../../domain/interfaces/useCase/IApproveMentorUseCase.ts";
import type { IRejectMentorUseCase } from "../../domain/interfaces/useCase/IRejectMentorUseCase.ts";
import type { IGetMentorDetailsUseCase } from "../../domain/interfaces/useCase/IGetMentorDetailsUseCase.ts";
import { UserRole } from "../../domain/enums/UserRole.ts";
import { UserStatus } from "../../domain/enums/UserStatus.ts";

const querySchema = z.object({
  search: z.string().trim().max(120).optional(),
  role: z.enum({ STUDENT: UserRole.STUDENT, MENTOR: UserRole.MENTOR }).optional(),
  status: z.enum(UserStatus).optional(),
  year: z.coerce.number().int().min(2000).max(9999).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

const statusSchema = z.object({
  status: z.enum({ ACTIVE: UserStatus.ACTIVE, SUSPENDED: UserStatus.SUSPENDED }),
});

const mentorQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
  status: z.enum(UserStatus).optional(),
  verificationStatus: z.enum(UserStatus).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export class UserController {
  constructor(
    private readonly listUsersUseCase: IListUsersUseCase,
    private readonly updateUserStatusUseCase: IUpdateUserStatusUseCase,
    private readonly listMentorsUseCase: IListMentorsUseCase,
    private readonly approveMentorUseCase: IApproveMentorUseCase,
    private readonly rejectMentorUseCase: IRejectMentorUseCase,
    private readonly getMentorDetailsUseCase: IGetMentorDetailsUseCase,
  ) {}

  async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    const parsedQuery = querySchema.safeParse(req.query);
    if (!parsedQuery.success) {
      throw new AppError(
        parsedQuery.error.issues[0]?.message ?? "Invalid user filters.",
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const users = await this.listUsersUseCase.execute(parsedQuery.data);
    ResponseHandler.success(res, "Users fetched successfully", users, HttpStatusCode.OK);
  }

  async listMentors(req: AuthenticatedRequest, res: Response): Promise<void> {
    const parsedQuery = mentorQuerySchema.safeParse(req.query);
    if (!parsedQuery.success) {
      throw new AppError(
        parsedQuery.error.issues[0]?.message ?? "Invalid mentor filters.",
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const mentors = await this.listMentorsUseCase.execute(parsedQuery.data);
    ResponseHandler.success(res, "Mentors fetched successfully", mentors, HttpStatusCode.OK);
  }

  async approveMentor(req: AuthenticatedRequest, res: Response): Promise<void> {
    const mentorId = req.params.mentorId;
    if (typeof mentorId !== "string" || !mentorId) {
      throw new AppError("A valid mentor ID is required.", HttpStatusCode.BAD_REQUEST);
    }

    const mentor = await this.approveMentorUseCase.execute(
      mentorId,
      this.requireActorId(req),
    );
    ResponseHandler.success(res, "Mentor approved successfully", mentor, HttpStatusCode.OK);
  }

  async rejectMentor(req: AuthenticatedRequest, res: Response): Promise<void> {
    const mentorId = req.params.mentorId;
    if (typeof mentorId !== "string" || !mentorId) {
      throw new AppError("A valid mentor ID is required.", HttpStatusCode.BAD_REQUEST);
    }

    const mentor = await this.rejectMentorUseCase.execute(
      mentorId,
      this.requireActorId(req),
    );
    ResponseHandler.success(
      res,
      "Mentor verification rejected. Status returned to active.",
      mentor,
      HttpStatusCode.OK,
    );
  }

  async getMentorDetails(req: AuthenticatedRequest, res: Response): Promise<void> {
    const mentorId = req.params.mentorId;
    if (typeof mentorId !== "string" || !mentorId) {
      throw new AppError("A valid mentor ID is required.", HttpStatusCode.BAD_REQUEST);
    }

    const mentor = await this.getMentorDetailsUseCase.execute(mentorId);
    ResponseHandler.success(res, "Mentor details fetched successfully", mentor, HttpStatusCode.OK);
  }

  async updateStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    const parsedBody = statusSchema.safeParse(req.body);
    if (!parsedBody.success) {
      throw new AppError(
        parsedBody.error.issues[0]?.message ?? "A valid user status is required.",
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const userId = req.params.userId;
    if (typeof userId !== "string" || !userId) {
      throw new AppError("A valid user ID is required.", HttpStatusCode.BAD_REQUEST);
    }

    const user = await this.updateUserStatusUseCase.execute(
      userId,
      parsedBody.data.status,
      this.requireActorId(req),
    );
    ResponseHandler.success(res, "User status updated successfully", user, HttpStatusCode.OK);
  }

  private requireActorId(req: AuthenticatedRequest): string {
    const actorId = req.user?.userId;
    if (!actorId) {
      throw new AppError("Unauthorized", HttpStatusCode.UNAUTHORIZED);
    }
    return actorId;
  }
}
