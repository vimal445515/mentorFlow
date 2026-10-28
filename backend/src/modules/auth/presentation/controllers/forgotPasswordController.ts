import type { Request, Response } from "express";
import type { ISendForgotOtpUseCase } from "../../domain/interfaces/userCase/ISendForgotOtpUseCase.ts";
import type { IVerifyForgotOtpUseCase } from "../../domain/interfaces/userCase/IVerifyForgotOtpUseCase.ts";
import type { IResendForgotOtpUseCase } from "../../domain/interfaces/userCase/IResendForgotOtpUseCase.ts";
import type { IResetPasswordUseCase } from "../../domain/interfaces/userCase/IResetPasswordUseCase.ts";
import { ResponseHandler } from "../../../../shared/response/responseHandler.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";

export class ForgotPasswordController {
  constructor(
    private readonly sendForgotOtpUseCase: ISendForgotOtpUseCase,
    private readonly resendForgotOtpUseCase: IResendForgotOtpUseCase,
    private readonly verifyForgotOtpUseCase: IVerifyForgotOtpUseCase,
    private readonly resetPasswordUseCase: IResetPasswordUseCase,
  ) {}

  async sendOtp(req: Request, res: Response): Promise<void> {
    const result = await this.sendForgotOtpUseCase.execute(req.body);
    ResponseHandler.success(res, result.message, null, HttpStatusCode.OK);
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    const result = await this.resendForgotOtpUseCase.execute(req.body);
    ResponseHandler.success(res, result.message, null, HttpStatusCode.OK);
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    const result = await this.verifyForgotOtpUseCase.execute(req.body);
    ResponseHandler.success(
      res,
      result.message,
      { resetToken: result.resetToken },
      HttpStatusCode.OK,
    );
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const result = await this.resetPasswordUseCase.execute(req.body);
    ResponseHandler.success(res, result.message, null, HttpStatusCode.OK);
  }
}
