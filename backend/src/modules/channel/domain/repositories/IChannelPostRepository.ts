import type { ChannelPost } from "../entities/ChannelPost.ts";
import type {
  ChannelPostInputDto,
  UpdateChannelPostInputDto,
} from "../../application/dto/ChannelPostInputDto.ts";

export interface ChannelPostAsset {
  key: string;
  name: string;
  mimeType: string;
}

export interface TemporaryPostFile {
  filePath: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface CreateChannelPostData {
  postId: string;
  channelId: string;
  mentorId: string;
  input: ChannelPostInputDto;
  file?: ChannelPostAsset;
  thumbnail?: ChannelPostAsset;
}

export interface UpdateChannelPostData {
  input: UpdateChannelPostInputDto;
  file?: ChannelPostAsset;
  thumbnail?: ChannelPostAsset;
}

export interface IChannelPostRepository {
  channelBelongsToMentor(channelId: string, mentorId: string): Promise<boolean>;
  isPublicChannel(channelId: string): Promise<boolean>;
  create(data: CreateChannelPostData): Promise<ChannelPost>;
  listForMentor(channelId: string, mentorId: string): Promise<ChannelPost[]>;
  listPublishedForPublicChannel(channelId: string): Promise<ChannelPost[]>;
  findForMentor(postId: string, mentorId: string): Promise<ChannelPost | null>;
  updateForMentor(
    postId: string,
    mentorId: string,
    data: UpdateChannelPostData,
  ): Promise<ChannelPost | null>;
  deleteForMentor(postId: string, mentorId: string): Promise<ChannelPost | null>;
}
