import type { RegisterDto } from "../dto/RegisterDto.ts";
import type { IUserRepository } from "../../domain/repositories/IUserRepository.ts";
import { User } from "../../domain/entities/User.ts";
import { UserRole } from "../../domain/enums/UserRole.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import type { IPasswordHasher } from "../../domain/interfaces/IPasswordHasher.ts";
import type { IRegisterUseCase } from "../../domain/interfaces/userCase/IRegisterUseCase.ts";
import type { ISignupStore, SignupData } from "../../domain/interfaces/ISignupStore.ts";
import type { IOtpStore } from "../../domain/interfaces/IOtpStore.ts";
import type { IEmailService } from "../../domain/interfaces/IEmailService.ts";
import { generateOtp } from "../../../../shared/utils/generateOtp.ts";
import { SuccessMessages } from "../../../../shared/constant/SuccessMessage.ts";

export class RegisterUseCase implements IRegisterUseCase{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly signupStore:ISignupStore,
    private readonly otpStore:IOtpStore,
    private readonly emailService:IEmailService
  ) {}
  async execute(data: RegisterDto) {
    const existingUser = await this.userRepository.findByEmailAndRole(
      data.email,
      data.role || UserRole.STUDENT,
    );
    if (existingUser) {
      throw new AppError(
        "An account with this email already exists.",
        HttpStatusCode.CONFLICT,
      );
    }
    const hashedPassword = await this.passwordHasher.hash(data.password);
    const user = new User({
      fullName: data.fullName,
      email: data.email,
      passwordHash: hashedPassword,
      role: data.role || UserRole.STUDENT,
      status: "ACTIVE",
      profileImageUrl: "",
    });

    await this.signupStore.save(data.email,data.role as UserRole,{...data,passwordHashed:hashedPassword} as SignupData);
    const otp = generateOtp();
    await this.otpStore.saveOtp(data.email,data.role as UserRole,otp);
    await this.emailService.sendSignupOtp(data.email,otp,data.role as UserRole);
    return {
      message:SuccessMessages.OTP_SENT,
    }
  }
}
