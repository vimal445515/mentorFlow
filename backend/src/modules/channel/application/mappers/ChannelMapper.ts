import type { Channel } from "../../domain/entities/Channel.ts";
import type { ChannelListResponseDto } from "../dto/ChannelListResponseDto.ts";
import type { ChannelListQueryDto } from "../dto/ChannelListQueryDto.ts";
import type { ChannelResponseDto } from "../dto/ChannelResponseDto.ts";

export class ChannelMapper {
  static toResponseDto(channel: Channel): ChannelResponseDto {
    if (!channel.channelId || !channel.createdAt || !channel.updatedAt) {
      throw new Error("Channel persistence fields are required for a response.");
    }

    return {
      channelId: channel.channelId,
      name: channel.name,
      category: channel.category,
      topic: channel.topic,
      description: channel.description,
      tags: channel.tags,
      status: channel.status,
      createdAt: channel.createdAt.toISOString(),
      updatedAt: channel.updatedAt.toISOString(),
    };
  }

  static toListResponseDto(
    channels: Channel[],
    total: number,
    query: ChannelListQueryDto,
  ): ChannelListResponseDto {
    return {
      channels: channels.map(ChannelMapper.toResponseDto),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }
}
