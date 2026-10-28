import type { ResetPasswordDto } from "../../../application/dto/ResetPasswordDto.ts";

export interface ResetPasswordResponse {
  message: string;
}

export interface IResetPasswordUseCase {
  execute(dto: ResetPasswordDto): Promise<ResetPasswordResponse>;
}
