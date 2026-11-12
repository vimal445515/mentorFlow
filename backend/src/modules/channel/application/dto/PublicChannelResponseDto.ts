import type { ChannelResponseDto } from "./ChannelResponseDto.ts";

export interface PublicChannelResponseDto extends ChannelResponseDto {
  mentorId: string;
  mentor: {
    fullName: string;
    headline: string | null;
    profileImageUrl: string | null;
    followerCount: number;
  };
  postsCount: number;
  latestPost: {
    title: string;
    publishedAt: string;
  } | null;
}
