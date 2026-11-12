import type { IChannelRepository } from "../../domain/repositories/IChannelRepository.ts";
import type { IListPublicChannelsUseCase } from "../../domain/interfaces/useCase/IListPublicChannelsUseCase.ts";
import type { ChannelListQueryDto } from "../dto/ChannelListQueryDto.ts";
import type { PublicChannelListResponseDto } from "../dto/PublicChannelListResponseDto.ts";
import { PublicChannelMapper } from "../mappers/PublicChannelMapper.ts";

export class ListPublicChannelsUseCase implements IListPublicChannelsUseCase {
  constructor(private readonly channelRepository: IChannelRepository) {}

  async execute(query: ChannelListQueryDto): Promise<PublicChannelListResponseDto> {
    const result = await this.channelRepository.listPublic(query);
    return PublicChannelMapper.toListResponseDto(
      result.channels,
      result.total,
      query,
    );
  }
}
