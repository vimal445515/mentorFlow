import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import type { IChannelRepository } from "../../domain/repositories/IChannelRepository.ts";
import type { IGetPublicChannelUseCase } from "../../domain/interfaces/useCase/IGetPublicChannelUseCase.ts";
import type { PublicChannelResponseDto } from "../dto/PublicChannelResponseDto.ts";
import { PublicChannelMapper } from "../mappers/PublicChannelMapper.ts";

export class GetPublicChannelUseCase implements IGetPublicChannelUseCase {
  constructor(private readonly channelRepository: IChannelRepository) {}

  async execute(channelId: string): Promise<PublicChannelResponseDto> {
    const channel = await this.channelRepository.findPublic(channelId);
    if (!channel) {
      throw new AppError("Channel not found.", HttpStatusCode.NOT_FOUND);
    }
    return PublicChannelMapper.toResponseDto(channel);
  }
}
