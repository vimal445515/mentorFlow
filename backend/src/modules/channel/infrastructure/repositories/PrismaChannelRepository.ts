import { injectable } from "inversify";
import type { Prisma } from "@prisma/client";
import { prisma } from "../../../../config/database.ts";
import type { Channel } from "../../domain/entities/Channel.ts";
import type {
  ChannelListCriteria,
  ChannelListResult,
  IChannelRepository,
} from "../../domain/repositories/IChannelRepository.ts";
import { ChannelMapper } from "../mappers/ChannelMapper.ts";

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
