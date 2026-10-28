import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser, PortalRole } from "@/features/auth/types/auth.types";

const STORAGE_KEY = "mentorflow_auth";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  portalMode: PortalRole;
}

const loadPersistedAuth = (): Pick<AuthState, "user" | "accessToken"> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const persisted = JSON.parse(raw) as { user?: AuthUser | null; token?: string | null };
      return { user: persisted.user ?? null, accessToken: persisted.token ?? null };
    }
  } catch (error) {
    console.error("Failed to load persisted auth:", error);
  }

  return { user: null, accessToken: null };
};

const persistedAuth = loadPersistedAuth();
const initialState: AuthState = {
  ...persistedAuth,
  isAuthenticated: Boolean(persistedAuth.accessToken),
  isLoading: false,
  portalMode: "STUDENT",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
    },
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = Boolean(action.payload);
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = Boolean(action.payload.accessToken);
    },
    setPortalMode: (state, action: PayloadAction<PortalRole>) => {
      state.portalMode = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setAccessToken, setCredentials, setPortalMode, clearUser } =
  authSlice.actions;
export const authStorageKey = STORAGE_KEY;
export default authSlice.reducer;
