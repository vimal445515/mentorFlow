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
import { ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import brandIcon from "@/assets/brand-icon.svg";
import { verifySignupOtp, resendSignupOtp } from "@/features/auth/api/authApi";
import { useToast } from "@/shared/components/Toast";
import { useAuthRouteState } from "@/features/auth/hooks/useAuthRouteState";

export const VerifyOtpPage: FC = () => {
  const navigate = useNavigate();
  const { email: routeEmail, role } = useAuthRouteState();
  const email = routeEmail || "alex.student@university.edu";
  const { showToast } = useToast();

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleInputChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (error) setError(null);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || "";
    }
    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerifyOtp = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length < 6) {
      setError("Please enter all 6 digits of the verification code.");
      showToast("Please enter the complete 6-digit code.", "error");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const response = await verifySignupOtp({
        email,
        role,
        otp: otpCode,
      });

      setIsSuccess(true);
      showToast(
        response.message || "OTP verified successfully! Redirecting to login...",
        "success",
        "Verified",
      );

      setTimeout(() => {
        navigate(role === "MENTOR" ? "/mentor-login" : "/student-login", {
          state: { email, justRegistered: true },
        });
      }, 1500);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid verification code. Please try again.";
      setError(msg);
      showToast(msg, "error", "Verification Failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (isResending) return;
    setIsResending(true);
    setError(null);

    try {
      await resendSignupOtp({ email, role });
      setTimeLeft(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      showToast(
        "A fresh 6-digit verification code has been sent to your email.",
        "success",
        "OTP Resent",
      );
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to resend OTP code. Please try again.";
      setError(msg);
      showToast(msg, "error", "Resend Failed");
    } finally {
      setIsResending(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-[0_4px_25px_-4px_rgba(0,0,0,0.06)] border border-stone-200/70 p-7 sm:p-9 transition-all">
        {/* Brand Header Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#FDF2EC] flex items-center justify-center border border-[#FADCD0] shadow-sm">
            <img src={brandIcon} alt="Brand" className="w-6 h-6" />
          </div>
        </div>

        {/* Title & Instructions */}
        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 leading-snug">
            Verify Your Email
          </h1>
          <p className="text-xs sm:text-[13px] text-stone-500 mt-2 leading-relaxed">
            We sent a 6-digit confirmation code to{" "}
            <span className="font-semibold text-stone-800 break-all">{email}</span>. Enter it below
            to activate your account.
          </p>
        </div>

        {/* Success Alert */}
        {isSuccess && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">Code verified! Redirecting to login...</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-snug">{error}</div>
          </div>
        )}

        {/* OTP Input Form */}
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="flex items-center justify-between gap-2 sm:gap-2.5">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                disabled={isVerifying || isSuccess}
                className={`w-12 h-14 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-bold rounded-2xl border transition-all focus:outline-none focus:ring-2 ${
                  digit
                    ? "border-[#C85A32] bg-[#FDF2EC]/20 text-stone-900 focus:ring-[#C85A32]/20"
                    : "border-stone-200 bg-white text-stone-900 focus:border-[#C85A32] focus:ring-[#C85A32]/20"
                }`}
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isVerifying || isSuccess || otp.join("").length < 6}
            className="w-full py-3.5 px-4 rounded-xl bg-[#C85A32] hover:bg-[#B34E29] text-white font-bold text-sm transition-all shadow-[0_2px_12px_rgba(200,90,50,0.25)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Code...</span>
              </>
            ) : (
              <>
                <span>Verify and Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Resend & Timer Footer */}
        <div className="mt-7 pt-6 border-t border-stone-100 flex flex-col items-center gap-2.5 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span>Didn't receive the code?</span>
            {timeLeft > 0 ? (
              <span className="font-semibold text-stone-700 font-mono">
                Resend in {formatTimer(timeLeft)}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="font-bold text-[#C85A32] hover:underline disabled:opacity-50 cursor-pointer"
              >
                {isResending ? "Sending..." : "Resend Code"}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer mt-1"
          >
            Wrong email address? Change email &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
