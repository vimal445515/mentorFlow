import type { ChannelPost } from "../../domain/entities/ChannelPost.ts";
import type { ChannelPostDto } from "../dto/ChannelPostDto.ts";

export class ChannelPostMapper {
  static toResponse(
    post: ChannelPost,
    fileUrl?: string,
    thumbnailUrl?: string,
  ): ChannelPostDto {
    return {
      postId: post.postId,
      channelId: post.channelId,
      type: post.type,
      title: post.title,
      ...(post.content !== null ? { content: post.content } : {}),
      ...(post.description !== null ? { description: post.description } : {}),
      ...(post.category !== null ? { category: post.category } : {}),
      ...(post.subject !== null ? { subject: post.subject } : {}),
      tags: post.tags,
      ...(fileUrl ? { fileUrl } : {}),
      ...(post.mediaName ? { fileName: post.mediaName } : {}),
      ...(thumbnailUrl ? { thumbnailUrl } : {}),
      ...(post.thumbnailName ? { thumbnailName: post.thumbnailName } : {}),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  }
}
