import { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

import { api } from "./axios";
import { refresh } from "@/features/auth/api/authApi";
import { setAccessToken, clearUser } from "@/features/auth/store/authSlice";
import { store } from "@/app/store/store";

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

        const responseData = error.response?.data as
      | { message?: string }
      | undefined;

    if (
      error.response?.status === 403 &&
      responseData?.message === "Account suspended. Please contact support."
    ) {
    store.dispatch(clearUser());
      return Promise.reject(error);
    }


    const requestUrl = originalRequest.url ?? "";

    const isAuthRequest =
      requestUrl.includes("/auth/student-login") ||
      requestUrl.includes("/auth/mentor-login") ||
      requestUrl.includes("/auth/admin-login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/verify-signup-otp") ||
      requestUrl.includes("/auth/resend-signup-otp") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/logout");

    if (isAuthRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refresh()
            .then(({ accessToken }) => {
              store.dispatch(setAccessToken(accessToken));
              return accessToken;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const accessToken = await refreshPromise;

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(clearUser());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
