import { api, ENDPOINTS } from "@/core/api";
import type { ApiResponse } from "@/core/types/api.types";
import type { ManagedUser, PaginatedUsers, UserListParams } from "../types/user.types";

export const getUsers = async (
  params: UserListParams,
  signal?: AbortSignal,
): Promise<ApiResponse<PaginatedUsers>> => {
  const response = await api.get<ApiResponse<PaginatedUsers>>(ENDPOINTS.USERS.LIST, {
    params,
    signal,
  });
  return response.data;
};

export const updateUserStatus = async (
  userId: string,
  status: "ACTIVE" | "SUSPENDED",
): Promise<ApiResponse<ManagedUser>> => {
  const response = await api.patch<ApiResponse<ManagedUser>>(
    ENDPOINTS.USERS.UPDATE_STATUS(userId),
    { status },
  );
  return response.data;
};
