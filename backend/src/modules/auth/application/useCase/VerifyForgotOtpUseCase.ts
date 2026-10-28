import crypto from "crypto";
import type { VerifyForgotOtpDto } from "../dto/VerifyForgotOtpDto.ts";
import type {
  IVerifyForgotOtpUseCase,
  VerifyForgotOtpResponse,
} from "../../domain/interfaces/userCase/IVerifyForgotOtpUseCase.ts";
import type { IOtpStore } from "../../domain/interfaces/IOtpStore.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { ErrorMessages } from "../../../../shared/constant/ErrorMessage.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { SuccessMessages } from "../../../../shared/constant/SuccessMessage.ts";

export class VerifyForgotOtpUseCase implements IVerifyForgotOtpUseCase {
  constructor(private readonly otpStore: IOtpStore) {}

  async execute(dto: VerifyForgotOtpDto): Promise<VerifyForgotOtpResponse> {
    const email = dto.email.trim().toLowerCase();
    const storedOtp = await this.otpStore.getForgotOtp(email);

    if (!storedOtp) {
      throw new AppError(ErrorMessages.OTP_EXPIRED, HttpStatusCode.BAD_REQUEST);
    }

    if (storedOtp !== dto.otp.trim()) {
      throw new AppError(ErrorMessages.INVALID_OTP, HttpStatusCode.BAD_REQUEST);
    }

    await this.otpStore.deleteForgotOtp(email);

    const resetToken = crypto.randomUUID();
    await this.otpStore.saveResetToken(email, resetToken);

    return {
      resetToken,
      message: SuccessMessages.OTP_VERIFIED,
    };
  }
}
