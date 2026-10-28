import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { clearUser, setAccessToken, setPortalMode, setUser } from "@/features/auth/store/authSlice";
import type { AuthUser, PortalRole } from "../types/auth.types";
import { logout as apiLogout } from "../api/authApi";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, accessToken, isAuthenticated, isLoading, portalMode } = useAppSelector(
    (state) => state.auth,
  );

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      dispatch(clearUser());
    }
  };

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    portalMode,
    setUser: (user: AuthUser | null) => dispatch(setUser(user)),
    setAccessToken: (token: string | null) => dispatch(setAccessToken(token)),
    setPortalMode: (mode: PortalRole) => dispatch(setPortalMode(mode)),
    logout: handleLogout,
  };
}

export default useAuth;
