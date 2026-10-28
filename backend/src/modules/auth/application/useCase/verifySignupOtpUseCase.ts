import { User } from "../../domain/entities/User.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import type { VerifySignupOtpDto } from "../dto/verifySignupOtpDto.ts";
import type { IUserRepository } from "../../domain/repositories/IUserRepository.ts";
import type { IOtpStore } from "../../domain/interfaces/IOtpStore.ts";
import type { ISignupStore } from "../../domain/interfaces/ISignupStore.ts";
import type { IVerifySignupOtpUseCase, VerifySignupOtpResponse } from "../../domain/interfaces/userCase/IVerifySignupOtpUseCase.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { ErrorMessages } from "../../../../shared/constant/ErrorMessage.ts";
import type { IWriteAuditLogUseCase } from "../../../audit-log/domain/interfaces/useCase/IWriteAuditLogUseCase.ts";
import { AuditAction } from "../../../audit-log/domain/entities/AuditLog.ts";


export class VerifySignupOtpUseCase implements IVerifySignupOtpUseCase{
    constructor(
        private readonly userRepository:IUserRepository,
        private readonly otpStore:IOtpStore,
        private readonly signupStore:ISignupStore,
        private readonly writeAuditLogUseCase: IWriteAuditLogUseCase,
    ){}

    async execute(dto: VerifySignupOtpDto): Promise<VerifySignupOtpResponse> {
        const storedOtp = await this.otpStore.getOtp(dto.email,dto.role);

        if(!storedOtp){
            throw new AppError(ErrorMessages.OTP_EXPIRED,HttpStatusCode.BAD_REQUEST);
        }

        if(storedOtp !== dto.otp){
            throw new AppError(ErrorMessages.INVALID_OTP,HttpStatusCode.BAD_REQUEST);
        }

        const signupData = await this.signupStore.get(dto.email,dto.role);

        if (!signupData) {
        throw new AppError(ErrorMessages.SIGNUP_SESSION_EXPIRED, HttpStatusCode.BAD_REQUEST);
            }

        const user = new User({
            fullName:signupData.fullName,
            email:signupData.email,
            passwordHash:signupData.passwordHashed,
            role:signupData.role,
            profileImageUrl:"",
            status:"ACTIVE"
        })
        const savedUser = await this.userRepository.create(user);

        await this.otpStore.deleteOtp(dto.email,dto.role);
        await this.signupStore.delete(dto.email,dto.role);
        await this.writeAuditLogUseCase.execute({
            actorId: savedUser.id!,
            action: AuditAction.USER_CREATED,
            description: `A new ${savedUser.role.toLowerCase()} account was created using email registration.`,
            resourceType: "USER",
            resourceId: savedUser.id!,
            metadata: { role: savedUser.role, provider: "PASSWORD" },
        });

        return {
            user:{
            id:savedUser.id!,
            fullName:savedUser.fullName,
            email:savedUser.email,
            role:savedUser.role
            }
        }
    }
}