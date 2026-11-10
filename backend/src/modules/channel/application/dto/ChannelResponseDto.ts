import type { ChannelStatus } from "../../domain/enums/ChannelStatus.ts";

export interface ChannelResponseDto {
  channelId: string;
  name: string;
  category: string;
  topic: string;
  description: string;
  tags: string[];
  status: ChannelStatus;
  createdAt: string;
  updatedAt: string;
}
