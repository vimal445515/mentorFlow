export const ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    VERIFY_SIGNUP_OTP: "/auth/verify-signup-otp",
    RESEND_SIGNUP_OTP: "/auth/resend-signup-otp",
    STUDENT_LOGIN: "/auth/student-login",
    MENTOR_LOGIN: "/auth/mentor-login",
    ADMIN_LOGIN: "/auth/admin-login",
    GOOGLE: "/auth/google",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD_SEND_OTP: "/auth/forgot-password/send-otp",
    FORGOT_PASSWORD_RESEND_OTP: "/auth/forgot-password/resend-otp",
    FORGOT_PASSWORD_VERIFY_OTP: "/auth/forgot-password/verify-otp",
    FORGOT_PASSWORD_RESET: "/auth/forgot-password/reset-password",
  },
  PROFILE: {
    ME: "/profile",
    UPDATE: "/profile",
    REQUEST_ADMIN_APPROVAL: "/profile/request-approval",
  },
  AVAILABILITY: {
    LIST: "/availability",
    CREATE: "/availability",
    DELETE: (slotId: string) => `/availability/${slotId}`,
  },
  CHANNELS: {
    LIST: "/channels",
    PUBLIC: "/channels/public",
    PUBLIC_BY_ID: (channelId: string) =>
      `/channels/public/${encodeURIComponent(channelId)}`,
    CREATE: "/channels",
    BY_ID: (channelId: string) => `/channels/${encodeURIComponent(channelId)}`,
  },
  CHANNEL_POSTS: {
    PUBLIC_BY_CHANNEL: (channelId: string) =>
      `/channels/public/${encodeURIComponent(channelId)}/posts`,
    BY_CHANNEL: (channelId: string) =>
      `/channels/${encodeURIComponent(channelId)}/posts`,
    BY_ID: (postId: string) => `/channels/posts/${encodeURIComponent(postId)}`,
  },
  CHANNEL_POST_INTERACTIONS: {
    COMMENTS: (postId: string) => `/channels/posts/${encodeURIComponent(postId)}/comments`,
    LIKE: (postId: string) => `/channels/posts/${encodeURIComponent(postId)}/like`,
  },
  USERS: {
    LIST: "/users",
    UPDATE_STATUS: (userId: string) => `/users/${userId}/status`,
    MENTORS: "/users/mentors",
    APPROVE_MENTOR: (mentorId: string) => `/users/mentors/${mentorId}/approve`,
    REJECT_MENTOR: (mentorId: string) => `/users/mentors/${mentorId}/reject`,
  },
  AUDIT_LOGS: {
    LIST: "/audit-logs",
  },
} as const;
