import { Navigate, type RouteObject } from "react-router-dom";
import { GuestGuard } from "@/shared/guards/GuestGuard";
import { PublicLayout } from "@/shared/layouts/PublicLayout";
import {
  AdminLoginPage,
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  VerifyOtpPage,
} from "./lazyPages";
import { withSuspense } from "@/shared/components/withSuspense";

export const publicRoutes: RouteObject = {
  element: <GuestGuard />,
  children: [
    {
      element: <PublicLayout />,
      children: [
        {
          path: "/login",
          element: <Navigate to="/student-login" replace />,
        },
        {
          path: "/student-login",
          element: withSuspense(<LoginPage />),
        },
        {
          path: "/mentor-login",
          element: withSuspense(<LoginPage />),
        },
        {
          path: "/register",
          element: withSuspense(<RegisterPage />),
        },
        {
          path: "/verify-otp",
          element: withSuspense(<VerifyOtpPage />),
        },
        {
          path: "/forgot-password",
          element: withSuspense(<ForgotPasswordPage />),
        },
        {
          path: "/admin-login",
          element: withSuspense(<AdminLoginPage />),
        },
      ],
    },
  ],
};
