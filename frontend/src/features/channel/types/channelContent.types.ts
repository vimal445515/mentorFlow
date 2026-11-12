export type ChannelContentType = "TEXT" | "VIDEO" | "DOCUMENT";

interface ChannelPostFields {
  type: ChannelContentType;
  title: string;
  tags: string[];
}

export interface TextArticlePostInput extends ChannelPostFields {
  type: "TEXT";
  content: string;
  thumbnail?: File;
}

export interface VideoPostInput extends ChannelPostFields {
  type: "VIDEO";
  description: string;
  category: string;
  file: File;
  thumbnail?: File;
}

export interface DocumentPostInput extends ChannelPostFields {
  type: "DOCUMENT";
  description: string;
  subject: string;
  file: File;
  thumbnail?: File;
}

export type CreateChannelPostInput = TextArticlePostInput | VideoPostInput | DocumentPostInput;

export type UpdateChannelPostInput =
  | TextArticlePostInput
  | (Omit<VideoPostInput, "file"> & { file?: File })
  | (Omit<DocumentPostInput, "file"> & { file?: File });

export interface ChannelPost {
  postId: string;
  channelId: string;
  type: ChannelContentType;
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
