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
    CREATE: "/channels",
    BY_ID: (channelId: string) => `/channels/${encodeURIComponent(channelId)}`,
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
