import type { IChannelRepository } from "../../domain/repositories/IChannelRepository.ts";
import type { IListChannelsUseCase } from "../../domain/interfaces/useCase/IListChannelsUseCase.ts";
import type { ChannelListQueryDto } from "../dto/ChannelListQueryDto.ts";
import type { ChannelListResponseDto } from "../dto/ChannelListResponseDto.ts";
import { ChannelMapper } from "../mappers/ChannelMapper.ts";

export class ListChannelsUseCase implements IListChannelsUseCase {
  constructor(private readonly channelRepository: IChannelRepository) {}

  async execute(
    mentorId: string,
    query: ChannelListQueryDto,
  ): Promise<ChannelListResponseDto> {
    const result = await this.channelRepository.listForMentor(mentorId, query);
    return ChannelMapper.toListResponseDto(result.channels, result.total, query);
  }
}
