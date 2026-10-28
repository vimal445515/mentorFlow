import type { ResetPasswordDto } from "../dto/ResetPasswordDto.ts";
import type {
  IResetPasswordUseCase,
  ResetPasswordResponse,
} from "../../domain/interfaces/userCase/IResetPasswordUseCase.ts";
import type { IUserRepository } from "../../domain/repositories/IUserRepository.ts";
import type { IOtpStore } from "../../domain/interfaces/IOtpStore.ts";
import type { IPasswordHasher } from "../../domain/interfaces/IPasswordHasher.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { ErrorMessages } from "../../../../shared/constant/ErrorMessage.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { SuccessMessages } from "../../../../shared/constant/SuccessMessage.ts";

export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly otpStore: IOtpStore,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: ResetPasswordDto): Promise<ResetPasswordResponse> {
    const email = dto.email.trim().toLowerCase();
    const storedToken = await this.otpStore.getResetToken(email);

    if (!storedToken || storedToken !== dto.resetToken) {
      throw new AppError(ErrorMessages.INVALID_RESET_TOKEN, HttpStatusCode.BAD_REQUEST);
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.id) {
      throw new AppError(ErrorMessages.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    const hashedPassword = await this.passwordHasher.hash(dto.newPassword);
    await this.userRepository.updatePassword(user.id, hashedPassword);
    await this.otpStore.deleteResetToken(email);

    return {
      message: SuccessMessages.PASSWORD_RESET_SUCCESSFUL,
    };
  }
}
