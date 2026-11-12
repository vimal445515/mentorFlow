import type { ChannelResponseDto } from "../../../application/dto/ChannelResponseDto.ts";

export interface IGetChannelUseCase {
  execute(mentorId: string, channelId: string): Promise<ChannelResponseDto>;
}
