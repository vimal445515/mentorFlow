import type { ChannelPostDto } from "../dto/ChannelPostDto.ts";
import type { IChannelPostRepository } from "../../domain/repositories/IChannelPostRepository.ts";
import type { IStorageService } from "../../../learningMaterials/domain/interfaces/IStorageService.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { toChannelPostDto } from "./channelPost.helpers.ts";

export class ListPublicChannelPostsUseCase {
  constructor(
    private readonly repository: IChannelPostRepository,
    private readonly storage: IStorageService,
  ) {}

  async execute(channelId: string): Promise<ChannelPostDto[]> {
    if (!(await this.repository.isPublicChannel(channelId))) {
      throw new AppError("Channel not found.", HttpStatusCode.NOT_FOUND);
    }
    const posts = await this.repository.listPublishedForPublicChannel(channelId);
    return Promise.all(posts.map((post) => toChannelPostDto(post, this.storage)));
  }
}
