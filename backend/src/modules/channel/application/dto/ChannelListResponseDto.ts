import type { ChannelResponseDto } from "./ChannelResponseDto.ts";

export interface ChannelListResponseDto {
  channels: ChannelResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
