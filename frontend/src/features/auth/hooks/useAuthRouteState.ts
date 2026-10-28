import { useLocation } from "react-router-dom";
import type { Role } from "@/features/auth/types/auth.types";

interface AuthRouteState {
  email?: string;
  role?: Role;
  justRegistered?: boolean;
  passwordReset?: boolean;
}

const isRole = (value: string | null | undefined): value is Role =>
  value === "STUDENT" || value === "MENTOR";

export const useAuthRouteState = () => {
  const location = useLocation();
  const state = (location.state as AuthRouteState | null) ?? {};
  const searchParams = new URLSearchParams(location.search);
  const roleFromUrl = searchParams.get("role");
  const role: Role = isRole(state.role)
    ? state.role
    : isRole(roleFromUrl)
      ? roleFromUrl
      : "STUDENT";
  const loginRole: Role = location.pathname === "/mentor-login" ? "MENTOR" : "STUDENT";

  return {
    email: state.email ?? searchParams.get("email") ?? "",
    role,
    loginRole,
    justRegistered: state.justRegistered ?? searchParams.get("registered") === "true",
    passwordReset: state.passwordReset ?? false,
  };
};
