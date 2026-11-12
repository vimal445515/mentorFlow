import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import type { IChannelRepository } from "../../domain/repositories/IChannelRepository.ts";
import type { IGetChannelUseCase } from "../../domain/interfaces/useCase/IGetChannelUseCase.ts";
import type { ChannelResponseDto } from "../dto/ChannelResponseDto.ts";
import { ChannelMapper } from "../mappers/ChannelMapper.ts";

export class GetChannelUseCase implements IGetChannelUseCase {
  constructor(private readonly channelRepository: IChannelRepository) {}

  async execute(mentorId: string, channelId: string): Promise<ChannelResponseDto> {
    const channel = await this.channelRepository.findForMentor(mentorId, channelId);
    if (!channel) {
      throw new AppError("Channel not found.", HttpStatusCode.NOT_FOUND);
    }
    return ChannelMapper.toResponseDto(channel);
  }
}
