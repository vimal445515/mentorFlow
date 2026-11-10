import { api, ENDPOINTS } from "@/core/api";
import type { ApiResponse } from "@/core/types/api.types";
import type {
  Channel,
  ChannelInput,
  ChannelListQuery,
  ChannelListResponse,
} from "../types/channel.types";

export async function listChannels(
  query: ChannelListQuery,
): Promise<ChannelListResponse> {
  const response = await api.get<ApiResponse<ChannelListResponse>>(
    ENDPOINTS.CHANNELS.LIST,
    { params: query },
  );
  if (!Array.isArray(response.data.data?.channels)) {
    throw new Error("Unexpected response while loading channels.");
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
