import type { PublicChannelResponseDto } from "../../../application/dto/PublicChannelResponseDto.ts";

export interface IGetPublicChannelUseCase {
  execute(channelId: string): Promise<PublicChannelResponseDto>;
}
