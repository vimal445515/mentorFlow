import { configureStore } from "@reduxjs/toolkit";
import authReducer, { authStorageKey } from "@/features/auth/store/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

store.subscribe(() => {
  const { user, accessToken } = store.getState().auth;

  try {
    if (user || accessToken) {
      localStorage.setItem(authStorageKey, JSON.stringify({ user, token: accessToken }));
    } else {
      localStorage.removeItem(authStorageKey);
    }
  } catch (error) {
    console.error("Failed to persist auth:", error);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
