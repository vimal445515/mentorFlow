import type { ResendForgotOtpDto } from "../../../application/dto/ResendForgotOtpDto.ts";

export interface ResendForgotOtpResponse {
  message: string;
}

export interface IResendForgotOtpUseCase {
  execute(dto: ResendForgotOtpDto): Promise<ResendForgotOtpResponse>;
}
