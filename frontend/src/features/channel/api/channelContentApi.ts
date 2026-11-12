import type { AxiosProgressEvent } from "axios";
import { api, ENDPOINTS } from "@/core/api";
import type { ApiResponse } from "@/core/types/api.types";
import type {
  ChannelPost,
  CreateChannelPostInput,
  UpdateChannelPostInput,
} from "../types/channelContent.types";

type ChannelPostUploadProgress = (progress: number) => void;

export async function listChannelPosts(
  channelId: string,
  signal?: AbortSignal,
): Promise<ChannelPost[]> {
  const response = await api.get<ApiResponse<ChannelPost[]>>(
    ENDPOINTS.CHANNEL_POSTS.BY_CHANNEL(channelId),
    { signal },
  );
  if (!response.data.data) {
    throw new Error("The server did not return the channel posts.");
  }
  return response.data.data;
}

function toFormData(input: CreateChannelPostInput | UpdateChannelPostInput): FormData {
  const formData = new FormData();
  formData.append("type", input.type);
  formData.append("title", input.title);
  formData.append("tags", JSON.stringify(input.tags));

  if ("content" in input) {
    formData.append("content", input.content);
  }
  if ("description" in input) {
    formData.append("description", input.description);
  }
  if ("category" in input) {
    formData.append("category", input.category);
  }
  if ("subject" in input) {
    formData.append("subject", input.subject);
  }
  if ("file" in input && input.file) {
    formData.append("file", input.file);
  }
  if ("thumbnail" in input && input.thumbnail) {
    formData.append("thumbnail", input.thumbnail);
  }

  return formData;
}

function getUploadConfig(onProgress?: ChannelPostUploadProgress) {
  return {
    headers: { "Content-Type": undefined },
    onUploadProgress: (event: AxiosProgressEvent) => {
      if (event.total && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    },
  };
}

export async function createChannelPost(
  channelId: string,
  input: CreateChannelPostInput,
  onProgress?: ChannelPostUploadProgress,
): Promise<ChannelPost> {
  const response = await api.post<ApiResponse<ChannelPost>>(
    ENDPOINTS.CHANNEL_POSTS.BY_CHANNEL(channelId),
    toFormData(input),
    getUploadConfig(onProgress),
  );
  if (!response.data.data) {
    throw new Error("The server did not return the created channel post.");
  }
  return response.data.data;
}

export async function updateChannelPost(
  postId: string,
  input: UpdateChannelPostInput,
  onProgress?: ChannelPostUploadProgress,
): Promise<ChannelPost> {
  const response = await api.put<ApiResponse<ChannelPost>>(
    ENDPOINTS.CHANNEL_POSTS.BY_ID(postId),
    toFormData(input),
    getUploadConfig(onProgress),
  );
  if (!response.data.data) {
    throw new Error("The server did not return the updated channel post.");
  }
  return response.data.data;
}

export async function deleteChannelPost(postId: string): Promise<void> {
  await api.delete<ApiResponse<null>>(ENDPOINTS.CHANNEL_POSTS.BY_ID(postId));
}
