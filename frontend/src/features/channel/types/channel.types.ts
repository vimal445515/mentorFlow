export type ChannelStatus = "ACTIVE" | "PRIVATE DRAFT" | "ARCHIVED";

export interface Channel {
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

export interface ChannelInput {
  name: string;
  category: string;
  topic: string;
  description: string;
  tags: string[];
  status: ChannelStatus;
}

export interface ChannelListQuery {
  page: number;
  limit: number;
  search?: string;
  status?: ChannelStatus;
  sortBy: "name" | "createdAt";
  sortOrder: "asc" | "desc";
}

export interface ChannelListResponse {
  channels: Channel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
