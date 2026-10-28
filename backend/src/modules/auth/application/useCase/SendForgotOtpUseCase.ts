import type { SendForgotOtpDto } from "../dto/SendForgotOtpDto.ts";
import type {
  ISendForgotOtpUseCase,
  SendForgotOtpResponse,
} from "../../domain/interfaces/userCase/ISendForgotOtpUseCase.ts";
import type { IUserRepository } from "../../domain/repositories/IUserRepository.ts";
import type { IOtpStore } from "../../domain/interfaces/IOtpStore.ts";
import type { IEmailService } from "../../domain/interfaces/IEmailService.ts";
import type { UserRole } from "../../domain/enums/UserRole.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { ErrorMessages } from "../../../../shared/constant/ErrorMessage.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { SuccessMessages } from "../../../../shared/constant/SuccessMessage.ts";
import { generateOtp } from "../../../../shared/utils/generateOtp.ts";

export class SendForgotOtpUseCase implements ISendForgotOtpUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly otpStore: IOtpStore,
    private readonly emailService: IEmailService,
  ) {}

  async execute(dto: SendForgotOtpDto): Promise<SendForgotOtpResponse> {
    const email = dto.email.trim().toLowerCase();
    const user = dto.role
      ? await this.userRepository.findByEmailAndRole(email, dto.role as any)
      : await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError(ErrorMessages.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    await this.otpStore.deleteForgotOtp(email);

    const otp = generateOtp();
    await this.otpStore.saveForgotOtp(email, otp);
    await this.emailService.sendForgotPasswordOtp(email, otp, user.role as UserRole);

    return {
      message: SuccessMessages.OTP_SENT,
    };
  }
}
