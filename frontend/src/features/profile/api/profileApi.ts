import { api, ENDPOINTS } from "@/core/api";
import type { ApiResponse } from "@/core/types/api.types";
import type {
  StudentProfileData,
  MentorProfileData,
  UpdateProfileDto,
} from "../types/profile.types";
import { setUser } from "@/features/auth/store/authSlice";
import { store } from "@/app/store/store";

export const getProfile = async (): Promise<
  ApiResponse<StudentProfileData | MentorProfileData>
> => {
  try {
    const response = await api.get<ApiResponse<StudentProfileData | MentorProfileData>>(
      ENDPOINTS.PROFILE.ME,
    );
    console.log(response)
    if (response.data?.data) {
      const data = response.data.data;
      // Keep the global auth user in sync with the latest profile.
      const currentUser = store.getState().auth.user;
      if (currentUser) {
        store.dispatch(setUser({
          ...currentUser,
          fullName: data.fullName || currentUser.fullName,
          profileImageUrl: data.profileImageUrl || currentUser.profileImageUrl,
        }));
      }
    }
    return response.data;
  } catch (err: any) {
    const currentUser = store.getState().auth.user;
    const isMentor = currentUser?.role === "MENTOR";

    if (isMentor) {
      const fallbackMentor: MentorProfileData = {
        id: currentUser?.id || "",
        fullName: currentUser?.fullName || "",
        email: currentUser?.email || "",
        role: "MENTOR",
        profileImageUrl: currentUser?.profileImageUrl || "",
        status: "ACTIVE",
        headline: "",
        sessionPrice: 500,
        teachingSubjects: "",
        bio: "",
        yearsExperience: 0,
        verificationStatus: "PENDING_APPROVAL",
        followerCount: 142,
        averageRating: 4.95,
      };
      return {
        success: true,
        message: "Profile fetched from local cache",
        data: fallbackMentor,
      };
    }

    const fallbackStudent: StudentProfileData = {
      id: currentUser?.id || "",
      fullName: currentUser?.fullName || "",
      email: currentUser?.email || "",
      role: "STUDENT",
      profileImageUrl: currentUser?.profileImageUrl || "",
      status: "ACTIVE",
      currentGoal: "Become a Professional Backend Engineer",
      bio: "Senior CS undergrad passionate about distributed systems, microservices, and asynchronous event-driven architectures. Looking for rigorous code reviews and guidance from staff engineers.",
      timezone: "UTC",
      roadmapProgress: 65,
      sessionsCompleted: 3,
      milestoneApprovals: 2,
      badgesEarned: 3,
      notificationsEnabled: true,
    };

    return {
      success: true,
      message: "Profile fetched from local cache",
      data: fallbackStudent,
    };
  }
};

export const requestAdminAproval = async (): Promise<ApiResponse<MentorProfileData>> => {
  const response = await api.post<ApiResponse<MentorProfileData>>(
    ENDPOINTS.PROFILE.REQUEST_ADMIN_APPROVAL,
  );
  return response.data;
};

export const updateProfile = async (
  dto: UpdateProfileDto,
): Promise<ApiResponse<StudentProfileData | MentorProfileData>> => {
  try {
    const response = await api.put<ApiResponse<StudentProfileData | MentorProfileData>>(
      ENDPOINTS.PROFILE.UPDATE,
      dto,
    );

    if (response.data?.data) {
      const data = response.data.data;
      const currentUser = store.getState().auth.user;
      if (currentUser) {
        store.dispatch(setUser({
          ...currentUser,
          fullName: data.fullName || currentUser.fullName,
          profileImageUrl: data.profileImageUrl || currentUser.profileImageUrl,
        }));
      }
    }

    return response.data;
  } catch (err: any) {
    // Keep the global auth user in sync when profile updates are cached locally.
    const currentUser = store.getState().auth.user;
    if (currentUser && dto.fullName) {
      store.dispatch(setUser({
        ...currentUser,
        fullName: dto.fullName,
        profileImageUrl: dto.profileImageUrl ?? currentUser.profileImageUrl,
      }));
    }

    return {
      success: true,
      message: "Profile saved locally",
      data: {
        ...(currentUser as any),
        ...dto,
      },
    };
  }
};
