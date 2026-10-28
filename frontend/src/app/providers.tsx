import type { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { store } from "@/app/store/store";
import { ToastProvider } from "@/shared/components/Toast";

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <ToastProvider>{children}</ToastProvider>
      </GoogleOAuthProvider>
    </Provider>
  );
}
