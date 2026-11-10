import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { Channel } from "../../domain/entities/Channel.ts";
import type { IChannelRepository } from "../../domain/repositories/IChannelRepository.ts";
import type { IUpdateChannelUseCase } from "../../domain/interfaces/useCase/IUpdateChannelUseCase.ts";
import type { UpdateChannelDto } from "../dto/UpdateChannelDto.ts";
import type { ChannelResponseDto } from "../dto/ChannelResponseDto.ts";
import { ChannelMapper } from "../mappers/ChannelMapper.ts";

export class UpdateChannelUseCase implements IUpdateChannelUseCase {
  constructor(private readonly channelRepository: IChannelRepository) {}

  async execute(
    mentorId: string,
    channelId: string,
    dto: UpdateChannelDto,
  ): Promise<ChannelResponseDto> {
    const updatedChannel = await this.channelRepository.updateForMentor(
      mentorId,
      channelId,
      new Channel({ ...dto, mentorId }),
    );
    if (!updatedChannel) {
      throw new AppError("Channel not found.", HttpStatusCode.NOT_FOUND);
    }
    return ChannelMapper.toResponseDto(updatedChannel);
  }
}
