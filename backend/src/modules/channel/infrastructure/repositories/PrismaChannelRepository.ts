import { injectable } from "inversify";
import type { Prisma } from "@prisma/client";
import { prisma } from "../../../../config/database.ts";
import type { Channel } from "../../domain/entities/Channel.ts";
import type {
  ChannelListCriteria,
  ChannelListResult,
  IChannelRepository,
  PublicChannelListResult,
  PublicChannelSummary,
} from "../../domain/repositories/IChannelRepository.ts";
import { ChannelStatus } from "../../domain/enums/ChannelStatus.ts";
import { ChannelMapper } from "../mappers/ChannelMapper.ts";

const publicChannelInclude = {
  mentor: {
    select: {
      headline: true,
      followerCount: true,
      user: {
        select: {
          fullName: true,
          profileImageUrl: true,
        },
      },
    },
  },
  posts: {
    where: { status: "published" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 1,
    select: {
      title: true,
      publishedAt: true,
      createdAt: true,
    },
  },
  _count: {
    select: {
      posts: { where: { status: "published" } },
    },
  },
} satisfies Prisma.ChannelInclude;

type PublicChannelRecord = Prisma.ChannelGetPayload<{
  include: typeof publicChannelInclude;
}>;

function toPublicChannelSummary(record: PublicChannelRecord): PublicChannelSummary {
  const latestPost = record.posts[0];
  return {
    channel: ChannelMapper.fromDb(record),
    mentor: {
      fullName: record.mentor.user.fullName,
      headline: record.mentor.headline,
      profileImageUrl: record.mentor.user.profileImageUrl,
      followerCount: record.mentor.followerCount,
    },
    postsCount: record._count.posts,
    latestPost: latestPost
      ? {
          title: latestPost.title,
          publishedAt: latestPost.publishedAt ?? latestPost.createdAt,
        }
      : null,
  };
}

@injectable()
export class PrismaChannelRepository implements IChannelRepository {
  async createForMentor(mentorId: string, channel: Channel): Promise<Channel> {
    const record = await prisma.channel.create({
      data: ChannelMapper.toCreateDb(channel, mentorId),
    });
    return ChannelMapper.fromDb(record);
  }

  async findForMentor(mentorId: string, channelId: string): Promise<Channel | null> {
    const record = await prisma.channel.findFirst({
      where: { channelId, mentorId, isDeleted: false },
    });
    return record ? ChannelMapper.fromDb(record) : null;
  }

  async findPublic(channelId: string): Promise<PublicChannelSummary | null> {
    const record = await prisma.channel.findFirst({
      where: {
        channelId,
        isDeleted: false,
        status: ChannelStatus.ACTIVE,
      },
      include: publicChannelInclude,
    });
    return record ? toPublicChannelSummary(record) : null;
  }

  async listForMentor(
    mentorId: string,
    query: ChannelListCriteria,
  ): Promise<ChannelListResult> {
    const where: Prisma.ChannelWhereInput = {
      mentorId,
      isDeleted: false,
      ...(query.search
        ? { name: { contains: query.search, mode: "insensitive" } }
        : {}),
      ...(query.status ? { status: query.status } : {}),
    };
    return this.list(where, query);
  }

  async listPublic(query: ChannelListCriteria): Promise<PublicChannelListResult> {
    const where: Prisma.ChannelWhereInput = {
      isDeleted: false,
      status: ChannelStatus.ACTIVE,
      ...(query.search
        ? { name: { contains: query.search, mode: "insensitive" } }
        : {}),
    };
    const primaryOrder: Prisma.ChannelOrderByWithRelationInput =
      query.sortBy === "name"
        ? { name: query.sortOrder }
        : { createdAt: query.sortOrder };
    const orderBy: Prisma.ChannelOrderByWithRelationInput[] = [
      primaryOrder,
      { channelId: "asc" },
    ];
    const [records, total] = await prisma.$transaction([
      prisma.channel.findMany({
        where,
        include: publicChannelInclude,
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.channel.count({ where }),
    ]);

    return {
      channels: records.map(toPublicChannelSummary),
      total,
    };
  }

  private async list(
    where: Prisma.ChannelWhereInput,
    query: ChannelListCriteria,
  ): Promise<ChannelListResult> {
    const primaryOrder: Prisma.ChannelOrderByWithRelationInput =
      query.sortBy === "name"
        ? { name: query.sortOrder }
        : { createdAt: query.sortOrder };
    const orderBy: Prisma.ChannelOrderByWithRelationInput[] = [
      primaryOrder,
      { channelId: "asc" },
    ];
    const [records, total] = await prisma.$transaction([
      prisma.channel.findMany({
        where,
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.channel.count({ where }),
    ]);

    return {
      channels: records.map(ChannelMapper.fromDb),
      total,
    };
  }

  async updateForMentor(
    mentorId: string,
    channelId: string,
    channel: Channel,
  ): Promise<Channel | null> {
    const result = await prisma.channel.updateMany({
      where: { channelId, mentorId, isDeleted: false },
      data: ChannelMapper.toUpdateDb(channel),
    });
    if (result.count === 0) return null;

    const record = await prisma.channel.findFirst({
      where: { channelId, mentorId, isDeleted: false },
    });
    return record ? ChannelMapper.fromDb(record) : null;
  }

  async deleteForMentor(mentorId: string, channelId: string): Promise<boolean> {
    const result = await prisma.channel.updateMany({
      where: { channelId, mentorId, isDeleted: false },
      data: { isDeleted: true },
    });
    return result.count > 0;
  }
}
