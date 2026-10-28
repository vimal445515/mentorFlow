import type { ResendSignupOtpDto } from "../../../application/dto/ResendSignupOtpDto.ts";

export interface IResendSignupOtp {
    execute(dto:ResendSignupOtpDto):Promise<void>;
} 