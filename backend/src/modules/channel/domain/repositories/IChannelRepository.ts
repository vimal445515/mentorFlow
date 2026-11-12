import type { Channel } from "../entities/Channel.ts";
import type { ChannelStatus } from "../enums/ChannelStatus.ts";
import type { ChannelSortBy } from "../enums/ChannelSortBy.ts";
import type { ChannelSortOrder } from "../enums/ChannelSortOrder.ts";

export interface ChannelListCriteria {
  page: number;
  limit: number;
  search?: string;
  status?: ChannelStatus;
  sortBy: ChannelSortBy;
  sortOrder: ChannelSortOrder;
}

export interface ChannelListResult {
  channels: Channel[];
  total: number;
}

export interface PublicChannelSummary {
  channel: Channel;
  mentor: {
    fullName: string;
    headline: string | null;
    profileImageUrl: string | null;
    followerCount: number;
  };
  postsCount: number;
  latestPost: {
    title: string;
    publishedAt: Date;
  } | null;
}

export interface PublicChannelListResult {
  channels: PublicChannelSummary[];
  total: number;
}

export interface IChannelRepository {
  createForMentor(mentorId: string, channel: Channel): Promise<Channel>;
  findForMentor(mentorId: string, channelId: string): Promise<Channel | null>;
  findPublic(channelId: string): Promise<PublicChannelSummary | null>;
  listForMentor(
    mentorId: string,
    query: ChannelListCriteria,
  ): Promise<ChannelListResult>;
  listPublic(query: ChannelListCriteria): Promise<PublicChannelListResult>;
  updateForMentor(
    mentorId: string,
    channelId: string,
    channel: Channel,
  ): Promise<Channel | null>;
  deleteForMentor(mentorId: string, channelId: string): Promise<boolean>;
}
