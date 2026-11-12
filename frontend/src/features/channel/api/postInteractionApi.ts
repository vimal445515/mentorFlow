import { api, ENDPOINTS } from "@/core/api";
import type { ApiResponse } from "@/core/types/api.types";
import type { PostComment, PostEngagement } from "../types/channelContent.types";

export async function listPostComments(
  postId: string,
  signal?: AbortSignal,
): Promise<PostComment[]> {
  const response = await api.get<ApiResponse<PostComment[]>>(
    ENDPOINTS.CHANNEL_POST_INTERACTIONS.COMMENTS(postId),
    { signal },
  );
  if (!response.data.data) {
    throw new Error("The server did not return the post comments.");
  }
  return response.data.data;
}

export async function createPostComment(postId: string, commentText: string): Promise<PostComment> {
  const response = await api.post<ApiResponse<PostComment>>(
    ENDPOINTS.CHANNEL_POST_INTERACTIONS.COMMENTS(postId),
    { commentText },
  );
  if (!response.data.data) {
    throw new Error("The server did not return the created comment.");
  }
  return response.data.data;
}

export async function likeChannelPost(postId: string): Promise<PostEngagement> {
  const response = await api.post<ApiResponse<PostEngagement>>(
    ENDPOINTS.CHANNEL_POST_INTERACTIONS.LIKE(postId),
  );
  if (!response.data.data) {
    throw new Error("The server did not return the post engagement.");
  }
  return response.data.data;
}

export async function unlikeChannelPost(postId: string): Promise<PostEngagement> {
  const response = await api.delete<ApiResponse<PostEngagement>>(
    ENDPOINTS.CHANNEL_POST_INTERACTIONS.LIKE(postId),
  );
  if (!response.data.data) {
    throw new Error("The server did not return the post engagement.");
  }
  return response.data.data;
}
