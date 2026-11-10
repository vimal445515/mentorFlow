import type { ChannelStatus } from "../../domain/enums/ChannelStatus.ts";

export interface CreateChannelDto {
  name: string;
  category: string;
  topic: string;
  description: string;
  tags: string[];
  status: ChannelStatus;
}
