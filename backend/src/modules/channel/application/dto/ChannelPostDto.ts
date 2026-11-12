import type { ChannelPostKind } from "../../domain/entities/ChannelPost.ts";

export interface ChannelPostDto {
  postId: string;
  channelId: string;
  type: ChannelPostKind;
  title: string;
  content?: string;
  description?: string;
  category?: string;
  subject?: string;
  tags: string[];
  fileUrl?: string;
  fileName?: string;
  thumbnailUrl?: string;
  thumbnailName?: string;
  createdAt: string;
  updatedAt: string;
}
