import { api, ENDPOINTS } from "@/core/api";
import type { ApiResponse } from "@/core/types/api.types";
import type {
  Channel,
  ChannelInput,
  ChannelListQuery,
  ChannelListResponse,
  PublicChannel,
  PublicChannelListResponse,
} from "../types/channel.types";

export async function listChannels(
  query: ChannelListQuery,
  signal?: AbortSignal,
): Promise<ChannelListResponse> {
  const response = await api.get<ApiResponse<ChannelListResponse>>(ENDPOINTS.CHANNELS.LIST, {
    params: query,
    signal,
  });
  if (!Array.isArray(response.data.data?.channels)) {
    throw new Error("Unexpected response while loading channels.");
  }
  return response.data.data;
}

export async function listPublicChannels(
  query: Omit<ChannelListQuery, "status">,
  signal?: AbortSignal,
): Promise<PublicChannelListResponse> {
  const response = await api.get<ApiResponse<PublicChannelListResponse>>(
    ENDPOINTS.CHANNELS.PUBLIC,
    { params: query, signal },
  );
  if (!Array.isArray(response.data.data?.channels)) {
    throw new Error("Unexpected response while loading public channels.");
  }
  return response.data.data;
}

export async function getPublicChannel(
  channelId: string,
  signal?: AbortSignal,
): Promise<PublicChannel> {
  const response = await api.get<ApiResponse<PublicChannel>>(
    ENDPOINTS.CHANNELS.PUBLIC_BY_ID(channelId),
    { signal },
  );
  if (!response.data.data) {
    throw new Error("The server did not return the public channel details.");
  }
  return response.data.data;
}

export async function getChannel(
  channelId: string,
  signal?: AbortSignal,
): Promise<Channel> {
  const response = await api.get<ApiResponse<Channel>>(
    ENDPOINTS.CHANNELS.BY_ID(channelId),
    { signal },
  );
  if (!response.data.data) {
    throw new Error("The server did not return the channel details.");
  }
  return response.data.data;
}

export async function createChannel(input: ChannelInput): Promise<Channel> {
  const response = await api.post<ApiResponse<Channel>>(
    ENDPOINTS.CHANNELS.CREATE,
    input,
  );
  if (!response.data.data) {
    throw new Error("The server did not return the created channel.");
  }
  return response.data.data;
}

export async function updateChannel(
  channelId: string,
  input: ChannelInput,
): Promise<Channel> {
  const response = await api.put<ApiResponse<Channel>>(
    ENDPOINTS.CHANNELS.BY_ID(channelId),
    input,
  );
  if (!response.data.data) {
    throw new Error("The server did not return the updated channel.");
  }
  return response.data.data;
}

export async function deleteChannel(channelId: string): Promise<void> {
  await api.delete<ApiResponse<null>>(ENDPOINTS.CHANNELS.BY_ID(channelId));
}
