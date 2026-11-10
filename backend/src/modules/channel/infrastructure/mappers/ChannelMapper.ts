import type { Channel as PrismaChannel, Prisma } from "@prisma/client";
import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { Channel } from "../../domain/entities/Channel.ts";
import { ChannelStatus } from "../../domain/enums/ChannelStatus.ts";

export class ChannelMapper {
  static fromDb(record: PrismaChannel): Channel {
    if (!Object.values(ChannelStatus).includes(record.status as ChannelStatus)) {
      throw new Error(`Unsupported channel status in database: ${record.status}`);
    }

    return new Channel({
      channelId: record.channelId,
      mentorId: record.mentorId,
      name: record.name,
      category: record.category,
      topic: record.topic,
      description: record.description,
      tags: record.tags,
      status: record.status as ChannelStatus,
      isDeleted: record.isDeleted,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toCreateDb(
    channel: Channel,
    mentorId: string,
  ): Prisma.ChannelUncheckedCreateInput {
    if (!mentorId) {
      throw new AppError("Mentor ID is required.", HttpStatusCode.BAD_REQUEST);
    }

    return {
      mentorId,
      name: channel.name,
      category: channel.category,
      topic: channel.topic,
      description: channel.description,
      tags: channel.tags,
      status: channel.status,
      isDeleted: false,
    };
  }

  static toUpdateDb(channel: Channel): Prisma.ChannelUpdateManyMutationInput {
    return {
      name: channel.name,
      category: channel.category,
      topic: channel.topic,
      description: channel.description,
      tags: channel.tags,
      status: channel.status,
    };
  }
}
