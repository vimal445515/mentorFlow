import type { Prisma } from "@prisma/client";
import { prisma } from "../../../../config/database.ts";
import type { ChannelPost } from "../../domain/entities/ChannelPost.ts";
import type {
  ChannelPostAsset,
  ChannelPostFeedItem,
  CreateChannelPostData,
  IChannelPostRepository,
  UpdateChannelPostData,
} from "../../domain/repositories/IChannelPostRepository.ts";
import { ChannelStatus } from "../../domain/enums/ChannelStatus.ts";
import { PrismaChannelPostMapper } from "../mappers/PrismaChannelPostMapper.ts";
import type { IPostInteractionRepository } from "../../../commentAndLikes/domain/repositories/IPostInteractionRepository.ts";

function toDatabaseType(type: ChannelPost["type"]): "article" | "video" | "document" {
  return type === "TEXT" ? "article" : type === "VIDEO" ? "video" : "document";
}

function assetFields(
  file?: ChannelPostAsset,
  thumbnail?: ChannelPostAsset,
): Pick<
  Prisma.ChannelPostCreateInput,
  | "mediaKey"
  | "mediaName"
  | "mediaMimeType"
  | "thumbnailKey"
  | "thumbnailName"
  | "thumbnailMimeType"
> {
  return {
    mediaKey: file?.key ?? null,
    mediaName: file?.name ?? null,
    mediaMimeType: file?.mimeType ?? null,
    thumbnailKey: thumbnail?.key ?? null,
    thumbnailName: thumbnail?.name ?? null,
    thumbnailMimeType: thumbnail?.mimeType ?? null,
  };
}

export class PrismaChannelPostRepository implements IChannelPostRepository {
  constructor(private readonly interactionRepository: IPostInteractionRepository) {}

  async channelBelongsToMentor(
    channelId: string,
    mentorId: string,
  ): Promise<boolean> {
    const channel = await prisma.channel.findFirst({
      where: { channelId, mentorId, isDeleted: false },
      select: { channelId: true },
    });
    return channel !== null;
  }

  async isPublicChannel(channelId: string): Promise<boolean> {
    const channel = await prisma.channel.findFirst({
      where: {
        channelId,
        status: ChannelStatus.ACTIVE,
        isDeleted: false,
      },
      select: { channelId: true },
    });
    return channel !== null;
  }

  async create(data: CreateChannelPostData): Promise<ChannelPost> {
    const record = await prisma.channelPost.create({
      data: {
        postId: data.postId,
        channelId: data.channelId,
        mentorId: data.mentorId,
        type: toDatabaseType(data.input.type),
        title: data.input.title,
        content: data.input.type === "TEXT" ? data.input.content : null,
        description:
          data.input.type === "TEXT" ? null : data.input.description,
        category: data.input.type === "VIDEO" ? data.input.category : null,
        subject: data.input.type === "DOCUMENT" ? data.input.subject : null,
        tags: data.input.tags,
        ...assetFields(data.file, data.thumbnail),
        status: "published",
        publishedAt: new Date(),
      },
    });
    return PrismaChannelPostMapper.toDomain(record);
  }

  async listForMentor(
    channelId: string,
    mentorId: string,
    viewerId: string,
  ): Promise<ChannelPostFeedItem[]> {
    const records = await prisma.channelPost.findMany({
      where: { channelId, mentorId, status: "published" },
      orderBy: [{ createdAt: "desc" }, { postId: "asc" }],
    });
    const posts = records.map(PrismaChannelPostMapper.toDomain);
    const engagements = await this.interactionRepository.getEngagements(
      posts.map((post) => post.postId),
      viewerId,
    );
    const engagementByPostId = new Map(engagements.map((item) => [item.postId, item]));
    return posts.map((post) => ({
      post,
      likesCount: engagementByPostId.get(post.postId)?.likesCount ?? 0,
      commentsCount: engagementByPostId.get(post.postId)?.commentsCount ?? 0,
      isLiked: engagementByPostId.get(post.postId)?.isLiked ?? false,
    }));
  }

  async listPublishedForPublicChannel(
    channelId: string,
    viewerId: string,
  ): Promise<ChannelPostFeedItem[]> {
    const records = await prisma.channelPost.findMany({
      where: {
        channelId,
        status: "published",
        channel: {
          isDeleted: false,
          status: ChannelStatus.ACTIVE,
        },
      },
      orderBy: [{ createdAt: "desc" }, { postId: "asc" }],
    });
    const posts = records.map(PrismaChannelPostMapper.toDomain);
    const engagements = await this.interactionRepository.getEngagements(
      posts.map((post) => post.postId),
      viewerId,
    );
    const engagementByPostId = new Map(engagements.map((item) => [item.postId, item]));
    return posts.map((post) => ({
      post,
      likesCount: engagementByPostId.get(post.postId)?.likesCount ?? 0,
      commentsCount: engagementByPostId.get(post.postId)?.commentsCount ?? 0,
      isLiked: engagementByPostId.get(post.postId)?.isLiked ?? false,
    }));
  }

  async findForMentor(postId: string, mentorId: string): Promise<ChannelPost | null> {
    const record = await prisma.channelPost.findFirst({
      where: { postId, mentorId },
    });
    return record ? PrismaChannelPostMapper.toDomain(record) : null;
  }

  async updateForMentor(
    postId: string,
    mentorId: string,
    data: UpdateChannelPostData,
  ): Promise<ChannelPost | null> {
    const input = data.input;
    const result = await prisma.channelPost.updateMany({
      where: { postId, mentorId },
      data: {
        type: toDatabaseType(input.type),
        title: input.title,
        content: input.type === "TEXT" ? input.content ?? null : null,
        description: input.type === "TEXT" ? null : input.description ?? null,
        category: input.type === "VIDEO" ? input.category ?? null : null,
        subject: input.type === "DOCUMENT" ? input.subject ?? null : null,
        tags: input.tags,
        ...(data.file
          ? {
              mediaKey: data.file.key,
              mediaName: data.file.name,
              mediaMimeType: data.file.mimeType,
            }
          : {}),
        ...(data.thumbnail
          ? {
              thumbnailKey: data.thumbnail.key,
              thumbnailName: data.thumbnail.name,
              thumbnailMimeType: data.thumbnail.mimeType,
            }
          : {}),
      },
    });
    if (result.count === 0) return null;

    return this.findForMentor(postId, mentorId);
  }

  async deleteForMentor(postId: string, mentorId: string): Promise<ChannelPost | null> {
    const record = await this.findForMentor(postId, mentorId);
    if (!record) return null;
    await prisma.channelPost.delete({ where: { postId } });
    return record;
  }
}
