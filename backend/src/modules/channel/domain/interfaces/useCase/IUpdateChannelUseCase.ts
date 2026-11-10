import type { UpdateChannelDto } from "../../../application/dto/UpdateChannelDto.ts";
import type { ChannelResponseDto } from "../../../application/dto/ChannelResponseDto.ts";

export interface IUpdateChannelUseCase {
  execute(
    mentorId: string,
    channelId: string,
    dto: UpdateChannelDto,
  ): Promise<ChannelResponseDto>;
}
