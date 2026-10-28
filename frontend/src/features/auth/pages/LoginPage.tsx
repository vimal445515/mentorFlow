import { useState, useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Sparkles,
  Loader2,
  CheckCircle2,
  Users,
} from "lucide-react";
import { useFormState } from "@/shared/hooks/useFormState";
import { googleAuth, mentorLogin, studentLogin } from "@/features/auth/api/authApi";
import { useToast } from "@/shared/components/Toast";
import type { Role } from "@/features/auth/types/auth.types";
import { useAuthRouteState } from "@/features/auth/hooks/useAuthRouteState";
import { GoogleAuthButton } from "../components/GoogleAuthButton";

const validateLoginForm = (formValues: { email: string; password: string }) => {
  const errs: Record<string, string> = {};
  if (!formValues.email.trim()) {
    errs.email = "Email address is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email.trim())) {
    errs.email = "Please enter a valid email address";
  }

  if (!formValues.password) {
    errs.password = "Password is required";
  } else if (formValues.password.length < 6) {
    errs.password = "Password must be at least 6 characters";
  }
  return errs;
};

export const LoginPage: FC = () => {
  const navigate = useNavigate();
  const {
    email: initialEmail,
    loginRole: initialRole,
    justRegistered,
    passwordReset,
  } = useAuthRouteState();
  const { showToast } = useToast();
  const activeRole = initialRole;
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
  } = useFormState(
    {
      email:
        initialEmail || (initialRole === "STUDENT" ? "vv8280203@gmail.com" : "vv8280203@gmail.com"),
      password: passwordReset ? "" : "123456",
    },
    validateLoginForm,
  );

  useEffect(() => {
    if (initialEmail && initialEmail !== values.email) {
      setFieldValue("email", initialEmail);
    }
  }, [initialEmail, values.email, setFieldValue]);

  const handleRoleChange = (newRole: Role) => {
    navigate(newRole === "MENTOR" ? "/mentor-login" : "/student-login");
  };

  const onSubmit = async (formValues: typeof values) => {
    setIsLoading(true);
    try {
      const response =
        activeRole === "STUDENT"
          ? await studentLogin({
              email: formValues.email.trim().toLowerCase(),
              password: formValues.password,
            })
          : await mentorLogin({
              email: formValues.email.trim().toLowerCase(),
              password: formValues.password,
            });

      if (response && response.data) {
        showToast(
          response.message || `Welcome back, ${response.data.user.fullName}!`,
          "success",
          activeRole === "STUDENT" ? "Student Portal" : "Mentor Portal",
        );
        navigate(activeRole === "MENTOR" ? "/mentor/profile" : "/student/profile");
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid email or password. Please try again.";
      showToast(errorMsg, "error", "Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const isStudent = activeRole === "STUDENT";
  const isBusy = isSubmitting || isLoading;
  const handleGoogleCredential = async (credential: string) => {
    setIsGoogleLoading(true);
    try {
      const response = await googleAuth({ credential, role: activeRole });
      showToast(
        response.message || `Welcome to MentorFlow, ${response.data?.user.fullName || "Learner"}!`,
        "success",
        activeRole === "STUDENT" ? "Student Portal" : "Mentor Portal",
      );
      navigate(activeRole === "MENTOR" ? "/mentor/profile" : "/student/profile");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to authenticate with Google. Please try again.";
      showToast(message, "error", "Google Sign-In Failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = (message: string) => {
    showToast(message, "error", "Google Authentication Failed");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-[0_4px_25px_-4px_rgba(0,0,0,0.06)] border border-stone-300 p-7 sm:p-9 transition-all">
        {/* Success Alert if just registered */}
        {justRegistered && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="leading-snug">
              <span className="font-semibold">Account verified!</span> You can now sign in with your
              credentials.
            </div>
          </div>
        )}

        {/* Success Alert if password was reset */}
        {passwordReset && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="leading-snug">
              <span className="font-semibold">Password updated!</span> You can now sign in with your
              new password.
            </div>
          </div>
        )}

        {/* Header Title & Subtitle */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FDF2EC] text-[#C85A32] border border-[#FADCD0] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Sign in to MentorFlow
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-stone-500">
            {isStudent
              ? "Continue your peer learning journey"
              : "Manage your mentees and mentorship sessions"}
          </p>
        </div>

        {/* Role Toggle */}
        <div className="bg-stone-100/90 p-1 rounded-2xl flex items-center mb-6 border border-stone-200">
          <button
            type="button"
            onClick={() => handleRoleChange("STUDENT")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              isStudent
                ? "bg-white text-stone-900 shadow-sm border border-stone-200"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("MENTOR")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              !isStudent
                ? "bg-white text-stone-900 shadow-sm border border-stone-200"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Mentor</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
                placeholder={isStudent ? "vv8280203@gmail.com" : "vv8280203@gmail.com"}
                disabled={isBusy}
                className={`w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-xl border bg-white text-stone-900 placeholder:text-stone-400 transition-colors focus:outline-none focus:ring-2 ${
                  touched.email && errors.email
                    ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500"
                    : "border-stone-300 hover:border-stone-400 focus:ring-[#C85A32]/20 focus:border-[#C85A32]"
                }`}
              />
            </div>
            {touched.email && errors.email && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  navigate("/forgot-password", {
                    state: { email: values.email, role: activeRole },
                  });
                }}
                className="text-xs font-semibold text-[#C85A32] hover:underline cursor-pointer"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={() => handleBlur("password")}
                placeholder="Enter your password"
                disabled={isBusy}
                className={`w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm rounded-xl border bg-white text-stone-900 placeholder:text-stone-400 transition-colors focus:outline-none focus:ring-2 ${
                  touched.password && errors.password
                    ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500"
                    : "border-stone-300 hover:border-stone-400 focus:ring-[#C85A32]/20 focus:border-[#C85A32]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.password}</p>
            )}
          </div>

          {/* Remember me checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#C85A32] border-stone-300 focus:ring-[#C85A32]/30 accent-[#C85A32]"
              />
              <span className="text-xs text-stone-600 font-medium">Remember on this device</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isBusy}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#C85A32] hover:bg-[#B34E29] text-white font-bold text-sm transition-all shadow-[0_2px_12px_rgba(200,90,50,0.25)] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer active:scale-[0.99]"
          >
            {isBusy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in as {isStudent ? "Student" : "Mentor"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Google Login */}
        <GoogleAuthButton
          role={activeRole}
          mode="signin"
          isLoading={isGoogleLoading}
          onCredential={handleGoogleCredential}
          onError={handleGoogleError}
        />

        {/* Footer links */}
        <div className="mt-6 pt-5 border-t border-stone-200 flex flex-col items-center gap-2.5 text-xs text-stone-500">
          <div>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register", { state: { role: activeRole } })}
              className="font-bold text-[#C85A32] hover:underline cursor-pointer"
            >
              Sign up here
            </button>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin-login")}
            className="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
          >
            Administrator Console &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
