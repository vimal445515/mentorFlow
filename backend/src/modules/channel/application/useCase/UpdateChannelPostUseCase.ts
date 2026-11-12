import type { ChannelPostDto } from "../dto/ChannelPostDto.ts";
import type { UpdateChannelPostInputDto } from "../dto/ChannelPostInputDto.ts";
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
  toChannelPostDto,
  uploadPostAsset,
} from "./channelPost.helpers.ts";

const isImage = (mimeType: string) => mimeType.startsWith("image/");

export class UpdateChannelPostUseCase {
  constructor(
    private readonly repository: IChannelPostRepository,
    private readonly storage: IStorageService,
  ) {}

  async execute(
    postId: string,
    mentorId: string,
    input: UpdateChannelPostInputDto,
    file?: TemporaryPostFile,
    thumbnail?: TemporaryPostFile,
  ): Promise<ChannelPostDto> {
    const currentPost = await this.repository.findForMentor(postId, mentorId);
    if (!currentPost) {
      throw new AppError("Channel post not found.", HttpStatusCode.NOT_FOUND);
    }
    if (currentPost.type !== input.type) {
      throw new AppError(
        "A post's content type cannot be changed.",
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const folder = `learning-materials/channels/${currentPost.channelId}/posts/${postId}`;
    let uploadedFile;
    let uploadedThumbnail;

    let updatedPost: ChannelPost | null = null;
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

      updatedPost = await this.repository.updateForMentor(postId, mentorId, {
        input,
        file: uploadedFile,
        thumbnail: uploadedThumbnail,
      });
      if (!updatedPost) {
        throw new AppError("Channel post not found.", HttpStatusCode.NOT_FOUND);
      }
    } catch (error) {
      try {
        await cleanupAssets(this.storage, [uploadedFile, uploadedThumbnail]);
      } catch (cleanupError) {
        throw new AggregateError(
          [error, cleanupError],
          "Channel post update failed and uploaded files could not be fully removed.",
        );
      }
      throw error;
    }

    await cleanupAssets(this.storage, [
      uploadedFile && currentPost.mediaKey
        ? {
            key: currentPost.mediaKey,
            name: currentPost.mediaName ?? "",
            mimeType: currentPost.mediaMimeType ?? "",
          }
        : undefined,
      uploadedThumbnail && currentPost.thumbnailKey
        ? {
            key: currentPost.thumbnailKey,
            name: currentPost.thumbnailName ?? "",
            mimeType: currentPost.thumbnailMimeType ?? "",
          }
        : undefined,
    ]);
    if (!updatedPost) {
      throw new AppError("Channel post not found.", HttpStatusCode.NOT_FOUND);
    }
    return toChannelPostDto(updatedPost, this.storage);
  }
}
