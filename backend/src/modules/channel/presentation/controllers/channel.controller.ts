import type { Response } from "express";
import type { AuthenticatedRequest } from "../../../../app/middlewares/authMiddleware.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { ResponseHandler } from "../../../../shared/response/responseHandler.ts";
import type { ICreateChannelUseCase } from "../../domain/interfaces/useCase/ICreateChannelUseCase.ts";
import type { IListChannelsUseCase } from "../../domain/interfaces/useCase/IListChannelsUseCase.ts";
import type { IListPublicChannelsUseCase } from "../../domain/interfaces/useCase/IListPublicChannelsUseCase.ts";
import type { IGetPublicChannelUseCase } from "../../domain/interfaces/useCase/IGetPublicChannelUseCase.ts";
import type { IUpdateChannelUseCase } from "../../domain/interfaces/useCase/IUpdateChannelUseCase.ts";
import type { IDeleteChannelUseCase } from "../../domain/interfaces/useCase/IDeleteChannelUseCase.ts";
import type { IGetChannelUseCase } from "../../domain/interfaces/useCase/IGetChannelUseCase.ts";
import type { CreateChannelDto } from "../../application/dto/CreateChannelDto.ts";
import type { UpdateChannelDto } from "../../application/dto/UpdateChannelDto.ts";
import { parseChannelListQuery } from "../validators/channel.validator.ts";

export class ChannelController {
  constructor(
    private readonly createChannelUseCase: ICreateChannelUseCase,
    private readonly listChannelsUseCase: IListChannelsUseCase,
    private readonly listPublicChannelsUseCase: IListPublicChannelsUseCase,
    private readonly getPublicChannelUseCase: IGetPublicChannelUseCase,
    private readonly updateChannelUseCase: IUpdateChannelUseCase,
    private readonly deleteChannelUseCase: IDeleteChannelUseCase,
    private readonly getChannelUseCase: IGetChannelUseCase,
  ) {}

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    const channel = await this.createChannelUseCase.execute(
      this.getMentorId(req),
      req.body as CreateChannelDto,
    );
    ResponseHandler.success(
      res,
      "Channel created successfully.",
      channel,
      HttpStatusCode.CREATED,
    );
  }

  async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    const query = parseChannelListQuery(req.query);
    const result = await this.listChannelsUseCase.execute(
      this.getMentorId(req),
      query,
    );
    ResponseHandler.success(res, "Channels fetched successfully.", result);
  }

  async listPublic(req: AuthenticatedRequest, res: Response): Promise<void> {
    this.assertStudent(req);
    const query = parseChannelListQuery(req.query);
    const result = await this.listPublicChannelsUseCase.execute(query);
    ResponseHandler.success(res, "Public channels fetched successfully.", result);
  }

  async getPublic(req: AuthenticatedRequest, res: Response): Promise<void> {
    this.assertStudent(req);
    const channel = await this.getPublicChannelUseCase.execute(
      this.getChannelId(req),
    );
    ResponseHandler.success(res, "Public channel fetched successfully.", channel);
  }

  async get(req: AuthenticatedRequest, res: Response): Promise<void> {
    const channel = await this.getChannelUseCase.execute(
      this.getMentorId(req),
      this.getChannelId(req),
    );
    ResponseHandler.success(res, "Channel fetched successfully.", channel);
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    const channel = await this.updateChannelUseCase.execute(
      this.getMentorId(req),
      this.getChannelId(req),
      req.body as UpdateChannelDto,
    );
    ResponseHandler.success(res, "Channel updated successfully.", channel);
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    await this.deleteChannelUseCase.execute(
      this.getMentorId(req),
      this.getChannelId(req),
    );
    ResponseHandler.success(res, "Channel deleted successfully.", null);
  }

  private getMentorId(req: AuthenticatedRequest): string {
    if (!req.user?.userId) {
      throw new AppError("Unauthorized.", HttpStatusCode.UNAUTHORIZED);
    }
    if (req.user.role !== "MENTOR") {
      throw new AppError(
        "Only mentors can manage channels.",
        HttpStatusCode.FORBIDDEN,
      );
    }
    return req.user.userId;
  }

  private assertStudent(req: AuthenticatedRequest): void {
    if (!req.user?.userId) {
      throw new AppError("Unauthorized.", HttpStatusCode.UNAUTHORIZED);
    }
    if (req.user.role !== "STUDENT") {
      throw new AppError(
        "Only students can view public channels.",
        HttpStatusCode.FORBIDDEN,
      );
    }
  }

  private getChannelId(req: AuthenticatedRequest): string {
    const channelId = Array.isArray(req.params.channelId)
      ? req.params.channelId[0]
      : req.params.channelId;
    if (!channelId) {
      throw new AppError("Channel ID is required.", HttpStatusCode.BAD_REQUEST);
    }
    return channelId;
  }
}
