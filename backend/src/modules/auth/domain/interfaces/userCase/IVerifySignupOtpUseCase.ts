import type { VerifySignupOtpDto } from "../../../application/dto/verifySignupOtpDto.ts";
import { UserRole } from "../../enums/UserRole.ts";

export interface VerifySignupOtpResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
  };
}

export interface IVerifySignupOtpUseCase {
  execute(dto: VerifySignupOtpDto): Promise<VerifySignupOtpResponse>;
}
