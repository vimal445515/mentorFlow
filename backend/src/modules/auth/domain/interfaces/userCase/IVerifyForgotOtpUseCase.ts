import type { VerifyForgotOtpDto } from "../../../application/dto/VerifyForgotOtpDto.ts";

export interface VerifyForgotOtpResponse {
  resetToken: string;
  message: string;
}

export interface IVerifyForgotOtpUseCase {
  execute(dto: VerifyForgotOtpDto): Promise<VerifyForgotOtpResponse>;
}
