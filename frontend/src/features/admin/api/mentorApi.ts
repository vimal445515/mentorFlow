import { api, ENDPOINTS } from "@/core/api";
import type { ApiResponse } from "@/core/types/api.types";
import type {
  ManagedMentor,
  MentorDetails,
  MentorListParams,
  PaginatedMentors,
} from "../types/mentor.types";

export const getMentors = async (
  params: MentorListParams,
  signal?: AbortSignal,
): Promise<ApiResponse<PaginatedMentors>> => {
  const response = await api.get<ApiResponse<PaginatedMentors>>(ENDPOINTS.USERS.MENTORS, {
    params,
    signal,
  });
  return response.data;
};

export const approveMentor = async (mentorId: string): Promise<ApiResponse<ManagedMentor>> => {
  const response = await api.patch<ApiResponse<ManagedMentor>>(
    ENDPOINTS.USERS.APPROVE_MENTOR(mentorId),
  );
  return response.data;
};

export const rejectMentor = async (mentorId: string): Promise<ApiResponse<ManagedMentor>> => {
  const response = await api.patch<ApiResponse<ManagedMentor>>(
    ENDPOINTS.USERS.REJECT_MENTOR(mentorId),
  );
  return response.data;
};

export const getMentorDetails = async (
  mentorId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<MentorDetails>> => {
  const response = await api.get<ApiResponse<MentorDetails>>(
    `${ENDPOINTS.USERS.MENTORS}/${mentorId}`,
    { signal },
  );
  return response.data;
};
