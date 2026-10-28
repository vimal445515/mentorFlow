export const AUTH_STORAGE_KEY = "mentorflow_auth";

export const AUTH_ROUTES = {
  LOGIN: "/student-login",
  MENTOR_LOGIN: "/mentor-login",
  ADMIN_LOGIN: "/admin-login",
  REGISTER: "/register",
  VERIFY_OTP: "/verify-otp",
  FORGOT_PASSWORD: "/forgot-password",
} as const;
