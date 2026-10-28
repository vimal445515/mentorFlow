import type { ResendSignupOtpDto } from "../dto/ResendSignupOtpDto.ts";
import type { IResendSignupOtp } from "../../domain/interfaces/userCase/IResendSignupOtpUseCase.ts";
import type { ISignupStore } from "../../domain/interfaces/ISignupStore.ts";
import type { IOtpStore } from "../../domain/interfaces/IOtpStore.ts";
import type { IEmailService } from "../../domain/interfaces/IEmailService.ts";
import type { UserRole } from "../../domain/enums/UserRole.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { ErrorMessages } from "../../../../shared/constant/ErrorMessage.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { generateOtp } from "../../../../shared/utils/generateOtp.ts";

export class ResendSignupOtp implements IResendSignupOtp{
    constructor(
        private readonly signupStore:ISignupStore,
        private readonly otpStore:IOtpStore,
        private readonly emailService:IEmailService

    ){}
    async execute(dto: ResendSignupOtpDto): Promise<void> {
        const signupData = await this.signupStore.get(dto.email,dto.role as UserRole);
        if(!signupData){
            throw new AppError(ErrorMessages.SIGNUP_SESSION_EXPIRED,HttpStatusCode.BAD_REQUEST);
        }

        await this.otpStore.deleteOtp(dto.email,dto.role as UserRole);

        const otp = generateOtp();

        await this.otpStore.saveOtp(dto.email,dto.role as UserRole,otp);
        await this.emailService.sendSignupOtp(dto.email,otp,dto.role as UserRole)
    }
}