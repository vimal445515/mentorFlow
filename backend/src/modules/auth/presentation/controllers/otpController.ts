import type { Request, Response } from "express";
import type { IVerifySignupOtpUseCase } from "../../domain/interfaces/userCase/IVerifySignupOtpUseCase.ts";
import { SuccessMessages } from "../../../../shared/constant/SuccessMessage.ts";
import { ResponseHandler } from "../../../../shared/response/responseHandler.ts";
import type { IResendSignupOtp } from "../../domain/interfaces/userCase/IResendSignupOtpUseCase.ts";

export class OtpConntroller {
  constructor(
    private readonly verifySignupOtpUseCase: IVerifySignupOtpUseCase,
    private readonly resendSignupOtpUseCase: IResendSignupOtp,
  ) {}

  async verifyOtp(req: Request, res: Response) {
    const result = await this.verifySignupOtpUseCase.execute(req.body);
    return ResponseHandler.success(res, SuccessMessages.OTP_VERIFIED, result);
  }

  async resendSignupOtp(req: Request, res: Response) {
    const { email, role } = req.body;
    await this.resendSignupOtpUseCase.execute({ email, role });
    return ResponseHandler.success(res, SuccessMessages.OTP_RESENT, null);
  }
}
