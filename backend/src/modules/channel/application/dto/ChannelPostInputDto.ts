import type { ChannelPostKind } from "../../domain/entities/ChannelPost.ts";

interface ChannelPostInputBase {
  type: ChannelPostKind;
  title: string;
  tags: string[];
}

export interface TextArticleInputDto extends ChannelPostInputBase {
  type: "TEXT";
  content: string;
}

export interface VideoPostInputDto extends ChannelPostInputBase {
  type: "VIDEO";
  description: string;
  category: string;
}

export interface DocumentPostInputDto extends ChannelPostInputBase {
  type: "DOCUMENT";
  description: string;
  subject: string;
}

export type ChannelPostInputDto =
  | TextArticleInputDto
  | VideoPostInputDto
  | DocumentPostInputDto;

export type UpdateChannelPostInputDto = ChannelPostInputDto;
