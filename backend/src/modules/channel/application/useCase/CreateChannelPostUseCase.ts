import { randomUUID } from "node:crypto";
import type { ChannelPostDto } from "../dto/ChannelPostDto.ts";
import type { ChannelPostInputDto } from "../dto/ChannelPostInputDto.ts";
import type { ChannelPost } from "../../domain/entities/ChannelPost.ts";
import type {
  IChannelPostRepository,
  TemporaryPostFile,
} from "../../domain/repositories/IChannelPostRepository.ts";
import type { IStorageService } from "../../../learningMaterials/domain/interfaces/IStorageService.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import {
  cleanupAssets,
  requireOwnedChannel,
  toChannelPostDto,
  uploadPostAsset,
} from "./channelPost.helpers.ts";

const isImage = (mimeType: string) => mimeType.startsWith("image/");

export class CreateChannelPostUseCase {
  constructor(
    private readonly repository: IChannelPostRepository,
    private readonly storage: IStorageService,
  ) {}

  async execute(
    channelId: string,
    mentorId: string,
    input: ChannelPostInputDto,
    file?: TemporaryPostFile,
    thumbnail?: TemporaryPostFile,
  ): Promise<ChannelPostDto> {
    await requireOwnedChannel(this.repository, channelId, mentorId);
    const postId = randomUUID();
    const folder = `learning-materials/channels/${channelId}/posts/${postId}`;
    let uploadedFile;
    let uploadedThumbnail;
    let createdPost: ChannelPost;

    try {
      if (file) {
        uploadedFile = await uploadPostAsset(
          this.storage,
          { ...file, folder },
          (mimeType) =>
            input.type === "VIDEO"
              ? mimeType.startsWith("video/")
              : input.type === "DOCUMENT" && mimeType === "application/pdf",
        );
      }
      if (thumbnail) {
        uploadedThumbnail = await uploadPostAsset(
          this.storage,
          { ...thumbnail, folder },
          isImage,
        );
      }
      createdPost = await this.repository.create({
        postId,
        channelId,
        mentorId,
        input,
        file: uploadedFile,
        thumbnail: uploadedThumbnail,
      });
    } catch (error) {
      try {
        await cleanupAssets(this.storage, [uploadedFile, uploadedThumbnail]);
      } catch (cleanupError) {
        throw new AggregateError(
          [error, cleanupError],
          "Channel post creation failed and uploaded files could not be fully removed.",
        );
      }
      throw error;
    }
    return toChannelPostDto(createdPost, this.storage);
  }
}
