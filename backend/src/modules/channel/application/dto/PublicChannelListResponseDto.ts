import type { ChannelListResponseDto } from "./ChannelListResponseDto.ts";
import type { PublicChannelResponseDto } from "./PublicChannelResponseDto.ts";

export interface PublicChannelListResponseDto
  extends Omit<ChannelListResponseDto, "channels"> {
  channels: PublicChannelResponseDto[];
}
