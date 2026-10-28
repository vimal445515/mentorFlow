import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  GraduationCap,
  Presentation,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Shield,
} from "lucide-react";
import type { Role } from "@/features/auth/types/auth.types";
import { googleAuth, register } from "@/features/auth/api/authApi";
import { useToast } from "@/shared/components/Toast";
import { useFormState } from "@/shared/hooks/useFormState";
import { useAuthRouteState } from "@/features/auth/hooks/useAuthRouteState";
import { GoogleAuthButton } from "../components/GoogleAuthButton";

export const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const { role: initialRole } = useAuthRouteState();
  const { showToast } = useToast();
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } =
    useFormState(
      {
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      (formValues) => {
        const errs: Record<string, string> = {};

        if (!formValues.fullName.trim()) {
          errs.fullName = "Full name is required";
        } else if (formValues.fullName.trim().length < 2) {
          errs.fullName = "Name must be at least 2 characters";
        }

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

        if (!formValues.confirmPassword) {
          errs.confirmPassword = "Confirm your password";
        } else if (formValues.password !== formValues.confirmPassword) {
          errs.confirmPassword = "Passwords do not match";
        }

        return errs;
      },
    );

  const onSubmit = async (formValues: typeof values) => {
    setGlobalError(null);

    try {
      const response = await register({
        fullName: formValues.fullName.trim(),
        email: formValues.email.trim().toLowerCase(),
        password: formValues.password,
        role: selectedRole,
      });

      showToast(
        response.message || "Verification code sent to your email!",
        "success",
        "Verification Code Sent",
      );

      navigate("/verify-otp", {
        state: {
          email: formValues.email.trim().toLowerCase(),
          role: selectedRole,
        },
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "An error occurred during account creation.";
      setGlobalError(message);
      showToast(message, "error", "Registration Failed");
    }
  };

  const isStudent = selectedRole === "STUDENT";
  const handleGoogleCredential = async (credential: string) => {
    setIsGoogleLoading(true);
    try {
      const response = await googleAuth({ credential, role: selectedRole });
      showToast(
        response.message || `Welcome to MentorFlow, ${response.data?.user.fullName || "Learner"}!`,
        "success",
        selectedRole === "STUDENT" ? "Student Portal" : "Mentor Portal",
      );
      const userRole = response.data?.user.role;
      if (userRole === "MENTOR") {
        navigate("/mentor/profile");
      } else if (userRole === "STUDENT") {
        navigate("/student/profile");
      } else {
        navigate(selectedRole === "MENTOR" ? "/mentor-login" : "/student-login");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to authenticate with Google. Please try again.";
      setGlobalError(message);
      showToast(message, "error", "Google Sign-In Failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = (message: string) => {
    setGlobalError(message);
    showToast(message, "error", "Google Authentication Failed");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-stone-200 p-7 sm:p-9 transition-all">
        {/* Title & Subtitle */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-stone-900 leading-snug">
            Create Your MentorFlow Account
          </h1>
          <p className="text-xs sm:text-[13px] text-stone-500 mt-1.5 font-normal">
            Choose whether you want to learn with AI roadmaps or mentor peers.
          </p>
        </div>

        {/* Global Error Banner */}
        {globalError && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug font-medium">{globalError}</div>
          </div>
        )}

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setSelectedRole("STUDENT")}
            className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
              isStudent
                ? "border-[#C85A32] bg-[#FDF2EC]/40 shadow-sm ring-1 ring-[#C85A32]"
                : "border-stone-300 hover:border-stone-400 bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`p-2 rounded-xl ${
                  isStudent ? "bg-[#C85A32] text-white" : "bg-stone-100 text-stone-500"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
              </span>
              {isStudent && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C85A32] text-white">
                  Active
                </span>
              )}
            </div>
            <div>
              <div className="font-bold text-sm text-stone-900">Student Learner</div>
              <div className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                Find peer mentors & study roadmap
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("MENTOR")}
            className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
              !isStudent
                ? "border-[#3D6946] bg-[#E8F3EB]/40 shadow-sm ring-1 ring-[#3D6946]"
                : "border-stone-300 hover:border-stone-400 bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`p-2 rounded-xl ${
                  !isStudent ? "bg-[#3D6946] text-white" : "bg-stone-100 text-stone-500"
                }`}
              >
                <Presentation className="w-4 h-4" />
              </span>
              {!isStudent && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3D6946] text-white">
                  Active
                </span>
              )}
            </div>
            <div>
              <div className="font-bold text-sm text-stone-900">Peer Mentor</div>
              <div className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                Guide students & share your expertise
              </div>
            </div>
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="fullName"
                value={values.fullName}
                onChange={handleChange}
                onBlur={() => handleBlur("fullName")}
                placeholder="e.g. Alex Morgan"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-xl border bg-white text-stone-900 placeholder:text-stone-400 transition-colors focus:outline-none focus:ring-2 ${
                  touched.fullName && errors.fullName
                    ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500"
                    : "border-stone-300 hover:border-stone-400 focus:ring-[#C85A32]/20 focus:border-[#C85A32]"
                }`}
              />
            </div>
            {touched.fullName && errors.fullName && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
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
                placeholder="you@university.edu"
                disabled={isSubmitting}
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

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Create Password
            </label>
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
                placeholder="At least 6 characters"
                disabled={isSubmitting}
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Shield className="w-4 h-4" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleBlur("confirmPassword")}
                placeholder="Repeat your password"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm rounded-xl border bg-white text-stone-900 placeholder:text-stone-400 transition-colors focus:outline-none focus:ring-2 ${
                  touched.confirmPassword && errors.confirmPassword
                    ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500"
                    : "border-stone-300 hover:border-stone-400 focus:ring-[#C85A32]/20 focus:border-[#C85A32]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#C85A32] hover:bg-[#B34E29] text-white font-bold text-sm transition-all shadow-[0_2px_12px_rgba(200,90,50,0.25)] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Continue to OTP Verification</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Google Registration */}
        <GoogleAuthButton
          role={selectedRole}
          mode="signup"
          isLoading={isGoogleLoading}
          onCredential={handleGoogleCredential}
          onError={handleGoogleError}
        />

        {/* Footer links */}
        <div className="mt-6 pt-5 border-t border-stone-100 flex flex-col items-center gap-2 text-xs text-stone-500">
          <div>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() =>
                navigate(selectedRole === "MENTOR" ? "/mentor-login" : "/student-login")
              }
              className="font-bold text-[#C85A32] hover:underline cursor-pointer"
            >
              Sign in &rarr;
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
