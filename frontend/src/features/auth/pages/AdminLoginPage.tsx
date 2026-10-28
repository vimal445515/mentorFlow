import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Key, Layers, Loader2, Lock, Shield } from "lucide-react";
import { useFormState } from "@/shared/hooks/useFormState";
import { adminLogin } from "@/features/auth/api/authApi";
import { useToast } from "@/shared/components/Toast";

interface AdminLoginValues {
  email: string;
  password: string;
}

function validateAdminLogin(values: AdminLoginValues) {
  const errors: Partial<Record<keyof AdminLoginValues, string>> = {};
  const email = values.email.trim();

  if (!email) {
    errors.email = "Admin email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
}

export const AdminLoginPage: FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormState<AdminLoginValues>(
    { email: "", password: "" },
    validateAdminLogin,
  );

  const onSubmit = async (formValues: AdminLoginValues) => {
    setIsLoading(true);
    try {
      const response = await adminLogin({
        email: formValues.email.trim().toLowerCase(),
        password: formValues.password,
      });

      if (!response.data || response.data.user.role !== "ADMIN") {
        throw new Error("Admin authentication was not confirmed.");
      }

      showToast(
        response.message || "Administrative access granted.",
        "success",
        "Admin Console",
      );
      navigate("/admin");
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : error instanceof Error
            ? error.message
            : "Unable to sign in. Please check your credentials and try again.";
      showToast(message, "error", "Authorization Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const isBusy = isSubmitting || isLoading;

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#121212] p-6 font-sans text-stone-100">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-[#DC2626] text-white">
          <Layers size={18} />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">
          MentorFlow
        </span>
      </div>

      <div className="flex flex-1 items-center justify-center px-0 py-10 sm:px-4">
        <div className="w-full max-w-md rounded-[28px] bg-white p-7 text-stone-900 shadow-2xl sm:p-8">
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600">
            <Shield size={14} />
            Administration Console
          </div>

          <h1 className="mb-2 text-2xl font-bold tracking-tight text-stone-900">
            System Authentication
          </h1>
          <p className="mb-6 text-sm leading-relaxed text-stone-500">
            Authorized administrators only. Sign in with your administrator
            account to continue.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-600"
              >
                Admin Identity / Email
              </label>
              <div className="relative flex items-center">
                <Key
                  size={16}
                  aria-hidden="true"
                  className="absolute left-3.5 text-stone-400"
                />
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  disabled={isBusy}
                  aria-invalid={Boolean(touched.email && errors.email)}
                  aria-describedby={touched.email ? "admin-email-error" : undefined}
                  className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-10 pr-4 text-sm text-stone-900 transition-all focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 disabled:opacity-60"
                />
              </div>
              {touched.email && errors.email && (
                <p id="admin-email-error" className="mt-1.5 text-xs text-red-600" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-600"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <Lock
                  size={16}
                  aria-hidden="true"
                  className="absolute left-3.5 text-stone-400"
                />
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                  disabled={isBusy}
                  aria-invalid={Boolean(touched.password && errors.password)}
                  aria-describedby={
                    touched.password ? "admin-password-error" : undefined
                  }
                  className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-10 pr-11 text-sm text-stone-900 transition-all focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((isVisible) => !isVisible)}
                  disabled={isBusy}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-3.5 rounded text-stone-400 transition-colors hover:text-stone-700 focus:outline-none focus:ring-2 focus:ring-red-600/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {showPassword ? (
                    <EyeOff size={16} aria-hidden="true" />
                  ) : (
                    <Eye size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
              {touched.password && errors.password && (
                <p
                  id="admin-password-error"
                  className="mt-1.5 text-xs text-red-600"
                  role="alert"
                >
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#DC2626] px-4 py-3.5 text-sm font-medium text-white shadow-lg shadow-red-600/20 transition-colors hover:bg-[#B91C1C] active:bg-[#991B1B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isBusy ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Secure Admin Login
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
};
