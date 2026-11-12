import type { PublicChannelSummary } from "../../domain/repositories/IChannelRepository.ts";
import type { PublicChannelListResponseDto } from "../dto/PublicChannelListResponseDto.ts";
import type { PublicChannelResponseDto } from "../dto/PublicChannelResponseDto.ts";
import type { ChannelListQueryDto } from "../dto/ChannelListQueryDto.ts";
import { ChannelMapper } from "./ChannelMapper.ts";

export class PublicChannelMapper {
  static toResponseDto(summary: PublicChannelSummary): PublicChannelResponseDto {
    return {
      ...ChannelMapper.toResponseDto(summary.channel),
      mentorId: summary.channel.mentorId,
      mentor: summary.mentor,
      postsCount: summary.postsCount,
      latestPost: summary.latestPost
        ? {
            title: summary.latestPost.title,
            publishedAt: summary.latestPost.publishedAt.toISOString(),
          }
        : null,
    };
  }

  static toListResponseDto(
    summaries: PublicChannelSummary[],
    total: number,
    query: ChannelListQueryDto,
  ): PublicChannelListResponseDto {
    return {
      channels: summaries.map(PublicChannelMapper.toResponseDto),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }
}
