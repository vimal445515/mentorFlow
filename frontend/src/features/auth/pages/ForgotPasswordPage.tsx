import {
  useState,
  useEffect,
  useRef,
  type FC,
  type FormEvent,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import brandIcon from "@/assets/brand-icon.svg";
import {
  sendForgotOtp,
  verifyForgotOtp,
  resendForgotOtp,
  resetPassword,
} from "@/features/auth/api/authApi";
import { useToast } from "@/shared/components/Toast";
import Swal from "sweetalert2";
import { useAuthRouteState } from "@/features/auth/hooks/useAuthRouteState";

const extractErrorMessage = (err: any, fallback: string): string => {
  const data = err?.response?.data;
  if (!data) return err?.message || fallback;
  if (typeof data.message === "string") return data.message;
  if (Array.isArray(data.message) && data.message.length > 0) {
    const first = data.message[0];
    if (typeof first === "string") return first;
    if (first && typeof first.message === "string") return first.message;
  }
  if (typeof data.error === "string") return data.error;
  return err?.message || fallback;
};

export const ForgotPasswordPage: FC = () => {
  const navigate = useNavigate();
  const { email: initialEmail, role } = useAuthRouteState();
  const returnPath = role === "MENTOR" ? "/mentor-login" : "/student-login";
  const { showToast } = useToast();

  // Current Step: 1 = Email, 2 = OTP, 3 = New Password
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility toggles
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI & loading states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Timer for Step 2 OTP expiry (starts at 60s / 1 min or can be adjusted)
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [isResending, setIsResending] = useState(false);

  // Refs for 6-digit OTP inputs
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Step 2 timer countdown
  useEffect(() => {
    if (currentStep !== 2 || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStep, timeLeft]);

  // Focus first input on Step 2
  useEffect(() => {
    if (currentStep === 2) {
      otpInputRefs.current[0]?.focus();
    }
  }, [currentStep]);

  // Format timer MM:SS (e.g. "00:54")
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // ================= STEP 1: Send OTP =================
  const handleStep1Submit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await sendForgotOtp({ email: cleanEmail });
      showToast(response.message || "Verification code sent to your email", "success", "Code Sent");
      setTimeLeft(300);
      setOtp(["", "", "", "", "", ""]);
      setCurrentStep(2);
    } catch (err: any) {
      const msg = extractErrorMessage(
        err,
        "Unable to send verification code. Please check your email.",
      );
      setErrorMessage(msg);
      showToast(msg, "error", "Request Failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ================= STEP 2: OTP Input Handlers & Verification =================
  const handleOtpChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const updated = [...otp];
    updated[index] = digit;
    setOtp(updated);
    setErrorMessage(null);

    // Auto-focus next input
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const updated = [...otp];
    for (let i = 0; i < 6; i++) {
      updated[i] = pasted[i] || "";
    }
    setOtp(updated);

    const targetIdx = Math.min(pasted.length, 5);
    otpInputRefs.current[targetIdx]?.focus();
  };

  const handleResendOtp = async () => {
    if (isResending || timeLeft > 0) return;
    setIsResending(true);
    setErrorMessage(null);

    try {
      const response = await resendForgotOtp({
        email: email.trim().toLowerCase(),
      });
      setTimeLeft(60);
      setOtp(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();
      showToast(
        response.message || "A new verification code has been sent.",
        "success",
        "OTP Resent",
      );
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to resend code. Please try again.");
      setErrorMessage(msg);
      showToast(msg, "error", "Resend Failed");
    } finally {
      setIsResending(false);
    }
  };

  const handleStep2Submit = async (e: FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setErrorMessage("Please enter all 6 digits of the verification code.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await verifyForgotOtp({
        email: email.trim().toLowerCase(),
        otp: otpCode,
      });

      const token = response.data?.resetToken || (response as any)?.resetToken;

      if (!token) {
        setErrorMessage(
          "Verification succeeded, but no reset token was received. Please try again.",
        );
        return;
      }

      setResetToken(token);
      showToast(response.message || "Code verified successfully", "success", "Verified");
      setCurrentStep(3);
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Invalid or expired verification code.");
      setErrorMessage(msg);
      showToast(msg, "error", "Verification Failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ================= STEP 3: Reset Password =================
  const handleStep3Submit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!resetToken) {
      setErrorMessage("Reset session expired. Please verify your email again.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const confirmResult = await Swal.fire({
      title: "Reset Password?",
      text: "Are you sure you want to update your password now?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, reset password",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#C85A32",
      cancelButtonColor: "#78716c",
      reverseButtons: true,
      focusCancel: true,
      customClass: {
        popup: "rounded-3xl border border-stone-200",
        confirmButton: "rounded-xl font-bold px-5 py-2.5 shadow-sm",
        cancelButton: "rounded-xl font-medium px-5 py-2.5",
      },
    });

    if (!confirmResult.isConfirmed) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await resetPassword({
        email: email.trim().toLowerCase(),
        resetToken,
        newPassword,
      });

      setSuccessMessage("Password reset successfully! Redirecting to login...");
      showToast(
        response.message || "Your password has been updated successfully.",
        "success",
        "Password Updated",
      );

      await Swal.fire({
        title: "Password Updated!",
        text: "Your password has been changed successfully. You will now be redirected to the sign-in page.",
        icon: "success",
        confirmButtonText: "Sign In Now",
        confirmButtonColor: "#C85A32",
        timer: 2000,
        timerProgressBar: true,
        customClass: {
          popup: "rounded-3xl border border-stone-200",
          confirmButton: "rounded-xl font-bold px-5 py-2.5 shadow-sm",
        },
      });

      navigate(returnPath, {
        state: { email, role, passwordReset: true },
      });
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Failed to reset password. Please try again.");
      setErrorMessage(msg);
      showToast(msg, "error", "Reset Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 bg-[#FAF8F5]">
      {/* Top Brand Logo */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[#C85A32] flex items-center justify-center shadow-xs">
          <img src={brandIcon} alt="MentorFlow" className="w-4 h-4 brightness-0 invert" />
        </div>
        <span className="text-xl font-bold tracking-tight text-stone-900">MentorFlow</span>
      </div>

      {/* Main Title & Subtitle */}
      <div className="text-center mb-6 max-w-sm">
        <h1 className="text-2xl sm:text-[26px] font-extrabold text-stone-900 tracking-tight">
          Recover Account Access
        </h1>
        <p className="mt-1 text-xs sm:text-[13px] text-stone-500 leading-normal">
          Follow the 3 simple steps to reset your security credentials
        </p>
      </div>

      {/* Stepper Progress Bar (1 - 2 - 3) */}
      <div className="flex items-center justify-center mb-6 w-full max-w-[280px]">
        {/* Step 1 Circle */}
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
            currentStep >= 1
              ? "bg-[#C85A32] text-white shadow-xs"
              : "bg-white border border-stone-300 text-stone-400"
          }`}
        >
          1
        </div>

        {/* Line 1 -> 2 */}
        <div
          className={`flex-1 h-[2px] transition-colors mx-2 ${
            currentStep >= 2 ? "bg-[#C85A32]" : "bg-stone-200"
          }`}
        />

        {/* Step 2 Circle */}
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
            currentStep >= 2
              ? "bg-[#C85A32] text-white shadow-xs"
              : "bg-white border border-stone-300 text-stone-400"
          }`}
        >
          2
        </div>

        {/* Line 2 -> 3 */}
        <div
          className={`flex-1 h-[2px] transition-colors mx-2 ${
            currentStep >= 3 ? "bg-[#C85A32]" : "bg-stone-200"
          }`}
        />

        {/* Step 3 Circle */}
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
            currentStep >= 3
              ? "bg-[#C85A32] text-white shadow-xs"
              : "bg-white border border-stone-300 text-stone-400"
          }`}
        >
          3
        </div>
      </div>

      {/* Main White Card */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl sm:rounded-3xl shadow-[0_4px_25px_-4px_rgba(0,0,0,0.06)] border border-stone-200/80 p-6 sm:p-8 transition-all">
        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Success Alert Box */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* ================= STEP 1: Enter Your Account ================= */}
        {currentStep === 1 && (
          <div>
            <div className="mb-5">
              <h2 className="text-base font-bold text-stone-900">Step 1: Enter Your Account</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                We'll send a 6-digit verification code to confirm ownership.
              </p>
            </div>

            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.student@tutorflow.com"
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 sm:py-3 text-sm rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 transition-colors focus:outline-none focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/20"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#C85A32] hover:bg-[#B34E29] text-white font-bold text-sm transition-all shadow-[0_2px_12px_rgba(200,90,50,0.25)] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ================= STEP 2: Enter Verification Code ================= */}
        {currentStep === 2 && (
          <div>
            <div className="mb-5">
              <h2 className="text-base font-bold text-stone-900">
                Step 2: Enter Verification Code
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Enter the 6-digit OTP code sent to your email.
              </p>
            </div>

            <form onSubmit={handleStep2Submit} className="space-y-5">
              {/* 6 Digit Input Boxes */}
              <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    disabled={isLoading}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-xl border border-stone-200 bg-white text-stone-900 focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/20 focus:outline-none transition-all"
                  />
                ))}
              </div>

              {/* Expiry & Resend Row */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-stone-500 font-medium">
                  Expires in {formatTimer(timeLeft)}
                </span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={timeLeft > 0 || isResending}
                  className={`font-semibold transition-colors ${
                    timeLeft > 0
                      ? "text-stone-400 cursor-not-allowed"
                      : "text-[#C85A32] hover:underline cursor-pointer"
                  }`}
                >
                  {isResending ? "Resending..." : "Resend OTP"}
                </button>
              </div>

              {/* Action Buttons: Back & Verify Code */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setCurrentStep(1);
                  }}
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-semibold text-sm transition-all text-center cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || otp.join("").length < 6}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#C85A32] hover:bg-[#B34E29] text-white font-bold text-sm transition-all shadow-[0_2px_12px_rgba(200,90,50,0.25)] flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 3: Create New Password ================= */}
        {currentStep === 3 && (
          <div>
            <div className="mb-5">
              <h2 className="text-base font-bold text-stone-900">Step 3: Create New Password</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Choose a strong password with at least 8 characters.
              </p>
            </div>

            <form onSubmit={handleStep3Submit} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="SecurePass2026!"
                    disabled={isLoading}
                    className="w-full pl-3.5 pr-10 py-2.5 sm:py-3 text-sm rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 transition-colors focus:outline-none focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="SecurePass2026!"
                    disabled={isLoading}
                    className="w-full pl-3.5 pr-10 py-2.5 sm:py-3 text-sm rounded-xl border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 transition-colors focus:outline-none focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#C85A32] hover:bg-[#B34E29] text-white font-bold text-sm transition-all shadow-[0_2px_12px_rgba(200,90,50,0.25)] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Password...</span>
                  </>
                ) : (
                  <>
                    <span>Save & Return to Log In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Bottom Link: Remembered your credentials? Back to Login */}
      <div className="mt-5 text-center text-xs text-stone-500">
        Remembered your credentials?{" "}
        <button
          type="button"
          onClick={() => navigate(returnPath)}
          className="font-bold text-[#C85A32] hover:underline cursor-pointer"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};
