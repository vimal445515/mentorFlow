import { Router } from "express";
import { registerSchema } from "../validators/register.validator.ts";
import { AuthController } from "../controllers/authController.ts";
import { validate } from "../../../../app/middlewares/validate.ts";
import { OtpConntroller } from "../controllers/otpController.ts";
import { ForgotPasswordController } from "../controllers/forgotPasswordController.ts";
import {
  studentLoginSchema,
  mentorLoginSchema,
  AdminLoginSchema,
} from "../validators/login.validator.ts";
import { googleAuthSchema } from "../validators/googleAuth.validator.ts";
import {
  sendForgotOtpSchema,
  resendForgotOtpSchema,
  verifyForgotOtpSchema,
  resetPasswordSchema,
} from "../validators/forgotPassword.validator.ts";
import { asyncHandler } from "../../../../shared/utils/asyncHandler.ts";

export function createAuthRoutes(
  authController: AuthController,
  otpController: OtpConntroller,
  forgotPasswordController: ForgotPasswordController,
) {
  const router = Router();

  router.post(
    "/register",
    validate(registerSchema),
    asyncHandler(authController.register.bind(authController)),
  );
  router.post(
    "/verify-signup-otp",
    asyncHandler(otpController.verifyOtp.bind(otpController)),
  );
  router.post(
    "/resend-signup-otp",
    asyncHandler(otpController.resendSignupOtp.bind(otpController)),
  );
  router.post(
    "/student-login",
    validate(studentLoginSchema),
    asyncHandler(authController.login.bind(authController)),
  );

  router.post(
    "/mentor-login",
    validate(mentorLoginSchema),
    asyncHandler(authController.login.bind(authController)),
  );

  router.post(
    "/admin-login",
    validate(AdminLoginSchema),
    asyncHandler(authController.login.bind(authController)),
  );

  router.post(
    "/google",
    validate(googleAuthSchema),
    asyncHandler(authController.googleAuth.bind(authController)),
  );

  router.post("/refresh", asyncHandler(authController.refresh.bind(authController)));

  router.post("/logout", asyncHandler(authController.logout.bind(authController)));

  // Forgot password routes
  router.post(
    "/forgot-password/send-otp",
    validate(sendForgotOtpSchema),
    asyncHandler(forgotPasswordController.sendOtp.bind(forgotPasswordController)),
  );
  router.post(
    "/forgot-password/resend-otp",
    validate(resendForgotOtpSchema),
    asyncHandler(forgotPasswordController.resendOtp.bind(forgotPasswordController)),
  );
  router.post(
    "/forgot-password/verify-otp",
    validate(verifyForgotOtpSchema),
    asyncHandler(forgotPasswordController.verifyOtp.bind(forgotPasswordController)),
  );
  router.post(
    "/forgot-password/reset-password",
    validate(resetPasswordSchema),
    asyncHandler(forgotPasswordController.resetPassword.bind(forgotPasswordController)),
  );

  return router;
}
