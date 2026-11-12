export type ChannelPostKind = "TEXT" | "VIDEO" | "DOCUMENT";

export interface ChannelPost {
  postId: string;
  channelId: string;
  mentorId: string;
  type: ChannelPostKind;
  title: string;
  content: string | null;
  description: string | null;
  category: string | null;
  subject: string | null;
  tags: string[];
  mediaKey: string | null;
  mediaName: string | null;
  mediaMimeType: string | null;
  thumbnailKey: string | null;
  thumbnailName: string | null;
  thumbnailMimeType: string | null;
  createdAt: Date;
  updatedAt: Date;
}
