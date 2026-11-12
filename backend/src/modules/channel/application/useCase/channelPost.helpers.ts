import type { ChannelPost } from "../../domain/entities/ChannelPost.ts";
import type {
  ChannelPostAsset,
  IChannelPostRepository,
} from "../../domain/repositories/IChannelPostRepository.ts";
import type {
  IStorageService,
  UploadFileInput,
} from "../../../learningMaterials/domain/interfaces/IStorageService.ts";
import { ChannelPostMapper } from "../mappers/ChannelPostMapper.ts";
import type { ChannelPostDto } from "../dto/ChannelPostDto.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";

export async function toChannelPostDto(
  post: ChannelPost,
  storage: IStorageService,
): Promise<ChannelPostDto> {
  const [fileUrl, thumbnailUrl] = await Promise.all([
    post.mediaKey ? storage.getUrl(post.mediaKey) : undefined,
    post.thumbnailKey ? storage.getUrl(post.thumbnailKey) : undefined,
  ]);
  return ChannelPostMapper.toResponse(post, fileUrl, thumbnailUrl);
}

export async function cleanupAssets(
  storage: IStorageService,
  assets: Array<ChannelPostAsset | undefined>,
): Promise<void> {
  const results = await Promise.allSettled(
    assets.filter((asset): asset is ChannelPostAsset => asset !== undefined)
      .map((asset) => storage.delete(asset.key)),
  );
  const failures = results.flatMap((result) =>
    result.status === "rejected" ? [result.reason] : [],
  );
  if (failures.length > 0) {
    throw new AggregateError(failures, "Failed to clean up channel post files.");
  }
}

export async function uploadPostAsset(
  storage: IStorageService,
  input: UploadFileInput,
  isAllowedMimeType: (mimeType: string) => boolean,
): Promise<ChannelPostAsset> {
  const uploaded = await storage.upload(input);
  if (!isAllowedMimeType(uploaded.mimeType)) {
    await storage.delete(uploaded.fileKey);
    throw new AppError("Uploaded file content does not match the post type.", HttpStatusCode.BAD_REQUEST);
  }
  return {
    key: uploaded.fileKey,
    name: uploaded.fileName,
    mimeType: uploaded.mimeType,
  };
}

export async function requireOwnedChannel(
  repository: IChannelPostRepository,
  channelId: string,
  mentorId: string,
): Promise<void> {
  if (!(await repository.channelBelongsToMentor(channelId, mentorId))) {
    throw new AppError("Channel not found.", HttpStatusCode.NOT_FOUND);
  }
}
