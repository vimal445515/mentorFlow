import { Channel } from "../../domain/entities/Channel.ts";
import type { IChannelRepository } from "../../domain/repositories/IChannelRepository.ts";
import type { ICreateChannelUseCase } from "../../domain/interfaces/useCase/ICreateChannelUseCase.ts";
import type { CreateChannelDto } from "../dto/CreateChannelDto.ts";
import type { ChannelResponseDto } from "../dto/ChannelResponseDto.ts";
import { ChannelMapper } from "../mappers/ChannelMapper.ts";

export class CreateChannelUseCase implements ICreateChannelUseCase {
  constructor(private readonly channelRepository: IChannelRepository) {}

  async execute(
    mentorId: string,
    dto: CreateChannelDto,
  ): Promise<ChannelResponseDto> {
    const channel = new Channel({ ...dto, mentorId });
    const createdChannel = await this.channelRepository.createForMentor(
      mentorId,
      channel,
    );
    return ChannelMapper.toResponseDto(createdChannel);
  }
}
