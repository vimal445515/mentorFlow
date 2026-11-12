import type { IChannelRepository } from "../../domain/repositories/IChannelRepository.ts";
import type { IListPublicChannelsUseCase } from "../../domain/interfaces/useCase/IListPublicChannelsUseCase.ts";
import type { ChannelListQueryDto } from "../dto/ChannelListQueryDto.ts";
import type { PublicChannelListResponseDto } from "../dto/PublicChannelListResponseDto.ts";
import { ChannelMapper } from "../mappers/ChannelMapper.ts";

export class ListPublicChannelsUseCase implements IListPublicChannelsUseCase {
  constructor(private readonly channelRepository: IChannelRepository) {}

  async execute(query: ChannelListQueryDto): Promise<PublicChannelListResponseDto> {
    const result = await this.channelRepository.listPublic(query);
    return {
      channels: result.channels.map(({ channel, mentor, postsCount, latestPost }) => ({
        ...ChannelMapper.toResponseDto(channel),
        mentor,
        postsCount,
        latestPost: latestPost
          ? {
              title: latestPost.title,
              publishedAt: latestPost.publishedAt.toISOString(),
            }
          : null,
      })),
      pagination: {
        page: query.page,
        limit: query.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / query.limit),
      },
    };
  }
}
