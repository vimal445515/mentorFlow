import type { FC } from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { Loader2 } from "lucide-react";
import type { Role } from "../types/auth.types";

interface GoogleAuthButtonProps {
  role: Role;
  mode?: "signin" | "signup";
  isLoading: boolean;
  onCredential: (credential: string) => void;
  onError?: (errorMessage: string) => void;
}

export const GoogleAuthButton: FC<GoogleAuthButtonProps> = ({
  role,
  mode = "signin",
  isLoading,
  onCredential,
  onError,
}) => {
  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      const errorMsg = "No credential received from Google";
      onError?.(errorMsg);
      return;
    }

    onCredential(credentialResponse.credential);
  };

  const handleGoogleError = () => {
    const errorMsg = "Google sign-in popup was closed or encountered an error";
    onError?.(errorMsg);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex items-center my-4">
        <div className="flex-1 border-t border-stone-300" />
        <span className="px-3 text-xs font-semibold uppercase tracking-wider text-stone-400 bg-white select-none">
          Or continue with
        </span>
        <div className="flex-1 border-t border-stone-300" />
      </div>

      <div className="w-full flex justify-center relative min-h-[44px]">
        {isLoading ? (
          <div className="w-full py-2.5 px-4 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-center gap-2 text-stone-600 text-sm font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-[#C85A32]" />
            <span>Verifying with Google & setting up {role.toLowerCase()} account...</span>
          </div>
        ) : (
          <div className="w-full flex justify-center [&>div]:!w-full [&>div]:flex [&>div]:justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
              theme="outline"
              size="large"
              shape="rectangular"
              text={mode === "signup" ? "signup_with" : "signin_with"}
              width="380"
            />
          </div>
        )}
      </div>
    </div>
  );
};
