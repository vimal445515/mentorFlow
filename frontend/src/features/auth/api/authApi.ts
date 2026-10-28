import { api, ENDPOINTS } from "@/core/api";
import type { ApiResponse } from "@/core/types/api.types";
import type {
  RegisterDto,
  VerifySignupOtpDto,
  ResendSignupOtpDto,
  LoginResponse,
  RefreshResponse,
  SendForgotOtpDto,
  VerifyForgotOtpDto,
  ResendForgotOtpDto,
  ResetPasswordDto,
  VerifyForgotOtpResponse,
} from "../types/auth.types";
import { setCredentials, clearUser } from "@/features/auth/store/authSlice";
import { store } from "@/app/store/store";

export const register = async (dto: RegisterDto): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>(ENDPOINTS.AUTH.REGISTER, dto);
  return response.data;
};

export const verifySignupOtp = async (dto: VerifySignupOtpDto): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>(ENDPOINTS.AUTH.VERIFY_SIGNUP_OTP, dto);
  return response.data;
};

export const resendSignupOtp = async (dto: ResendSignupOtpDto): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>(ENDPOINTS.AUTH.RESEND_SIGNUP_OTP, dto);
  return response.data;
};

export const studentLogin = async (credentials: {
  email: string;
  password: string;
}): Promise<ApiResponse<LoginResponse>> => {
  const response = await api.post<ApiResponse<LoginResponse>>(ENDPOINTS.AUTH.STUDENT_LOGIN, {
    ...credentials,
    role: "STUDENT",
  });

  if (response.data?.data) {
    store.dispatch(setCredentials(response.data.data));
  }
  return response.data;
};

export const mentorLogin = async (credentials: {
  email: string;
  password: string;
}): Promise<ApiResponse<LoginResponse>> => {
  const response = await api.post<ApiResponse<LoginResponse>>(ENDPOINTS.AUTH.MENTOR_LOGIN, {
    ...credentials,
    role: "MENTOR",
  });

  if (response.data?.data) {
    store.dispatch(setCredentials(response.data.data));
  }
  return response.data;
};

export const adminLogin = async (credentials: {
  email: string;
  password: string;
}): Promise<ApiResponse<LoginResponse>> => {
  const response = await api.post<ApiResponse<LoginResponse>>(ENDPOINTS.AUTH.ADMIN_LOGIN, {
    ...credentials,
    role: "ADMIN",
  });

  if (response.data?.data) {
    store.dispatch(setCredentials(response.data.data));
  }
  return response.data;
};

export const googleAuth = async (dto: {
  credential: string;
  role: "STUDENT" | "MENTOR";
}): Promise<ApiResponse<LoginResponse>> => {
  const response = await api.post<ApiResponse<LoginResponse>>(ENDPOINTS.AUTH.GOOGLE, dto);

  if (response.data?.data) {
    store.dispatch(setCredentials(response.data.data));
  }
  return response.data;
};

export const refresh = async (): Promise<RefreshResponse> => {
  const response = await api.post<ApiResponse<RefreshResponse>>(ENDPOINTS.AUTH.REFRESH);
  const token = response.data?.data?.accessToken || (response.data as any)?.accessToken;
  if (!token) throw new Error("No access token returned from refresh");
  return { accessToken: token };
};

export const logout = async (): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>(ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  } finally {
    store.dispatch(clearUser());
  }
};

export const sendForgotOtp = async (dto: SendForgotOtpDto): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>(ENDPOINTS.AUTH.FORGOT_PASSWORD_SEND_OTP, dto);
  return response.data;
};

export const resendForgotOtp = async (dto: ResendForgotOtpDto): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>(ENDPOINTS.AUTH.FORGOT_PASSWORD_RESEND_OTP, dto);
  return response.data;
};

export const verifyForgotOtp = async (
  dto: VerifyForgotOtpDto,
): Promise<ApiResponse<VerifyForgotOtpResponse>> => {
  const response = await api.post<ApiResponse<VerifyForgotOtpResponse>>(
    ENDPOINTS.AUTH.FORGOT_PASSWORD_VERIFY_OTP,
    dto,
  );
  return response.data;
};

export const resetPassword = async (dto: ResetPasswordDto): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>(ENDPOINTS.AUTH.FORGOT_PASSWORD_RESET, dto);
  return response.data;
};
