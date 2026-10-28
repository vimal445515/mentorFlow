import type { SendForgotOtpDto } from "../../../application/dto/SendForgotOtpDto.ts";

export interface SendForgotOtpResponse {
  message: string;
}

export interface ISendForgotOtpUseCase {
  execute(dto: SendForgotOtpDto): Promise<SendForgotOtpResponse>;
}
