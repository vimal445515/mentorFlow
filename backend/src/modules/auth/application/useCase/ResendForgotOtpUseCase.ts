import type { ResendForgotOtpDto } from "../dto/ResendForgotOtpDto.ts";
import type {
  IResendForgotOtpUseCase,
  ResendForgotOtpResponse,
} from "../../domain/interfaces/userCase/IResendForgotOtpUseCase.ts";
import type { IUserRepository } from "../../domain/repositories/IUserRepository.ts";
import type { IOtpStore } from "../../domain/interfaces/IOtpStore.ts";
import type { IEmailService } from "../../domain/interfaces/IEmailService.ts";
import type { UserRole } from "../../domain/enums/UserRole.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { ErrorMessages } from "../../../../shared/constant/ErrorMessage.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { SuccessMessages } from "../../../../shared/constant/SuccessMessage.ts";
import { generateOtp } from "../../../../shared/utils/generateOtp.ts";

export class ResendForgotOtpUseCase implements IResendForgotOtpUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly otpStore: IOtpStore,
    private readonly emailService: IEmailService,
  ) {}

  async execute(dto: ResendForgotOtpDto): Promise<ResendForgotOtpResponse> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(ErrorMessages.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    await this.otpStore.deleteForgotOtp(email);

    const otp = generateOtp();
    await this.otpStore.saveForgotOtp(email, otp);
    await this.emailService.sendForgotPasswordOtp(email, otp, user.role as UserRole);

    return {
      message: SuccessMessages.OTP_RESENT,
    };
  }
}
