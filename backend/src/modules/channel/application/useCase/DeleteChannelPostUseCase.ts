import type { IChannelPostRepository } from "../../domain/repositories/IChannelPostRepository.ts";
import type { IStorageService } from "../../../learningMaterials/domain/interfaces/IStorageService.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { cleanupAssets } from "./channelPost.helpers.ts";

export class DeleteChannelPostUseCase {
  constructor(
    private readonly repository: IChannelPostRepository,
    private readonly storage: IStorageService,
  ) {}

  async execute(postId: string, mentorId: string): Promise<void> {
    const post = await this.repository.findForMentor(postId, mentorId);
    if (!post) {
      throw new AppError("Channel post not found.", HttpStatusCode.NOT_FOUND);
    }
    await cleanupAssets(this.storage, [
      post.mediaKey
        ? {
            key: post.mediaKey,
            name: post.mediaName ?? "",
            mimeType: post.mediaMimeType ?? "",
          }
        : undefined,
      post.thumbnailKey
        ? {
            key: post.thumbnailKey,
            name: post.thumbnailName ?? "",
            mimeType: post.thumbnailMimeType ?? "",
          }
        : undefined,
    ]);
    const deletedPost = await this.repository.deleteForMentor(postId, mentorId);
    if (!deletedPost) {
      throw new AppError("Channel post not found.", HttpStatusCode.NOT_FOUND);
    }
  }
}
