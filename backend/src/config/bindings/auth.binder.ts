import { Container } from "inversify";
import { TYPES } from "../types.ts";
import type { IRegisterUseCase } from "../../modules/auth/domain/interfaces/userCase/IRegisterUseCase.ts";
import { RegisterUseCase } from "../../modules/auth/application/useCase/RegisterUserCase.ts";
import type { IUserRepository } from "../../modules/auth/domain/repositories/IUserRepository.ts";
import { PrismaUserRepository } from "../../modules/auth/infrastructrue/repositories/PrismaUserRepository.ts";
import type { IPasswordHasher } from "../../modules/auth/domain/interfaces/IPasswordHasher.ts";
import { BcryptPasswordHasher } from "../../modules/auth/infrastructrue/services/BcryptPasswordHasher.ts";
import { AuthController } from "../../modules/auth/presentation/controllers/authController.ts";
import { createAuthRoutes } from "../../modules/auth/presentation/routes/auth.routes.ts";
import type { IOtpStore } from "../../modules/auth/domain/interfaces/IOtpStore.ts";
import type { IEmailService } from "../../modules/auth/domain/interfaces/IEmailService.ts";
import type { ISignupStore } from "../../modules/auth/domain/interfaces/ISignupStore.ts";
import { RedisSignupStore } from "../../modules/auth/infrastructrue/signupStore/RedisSignupStore.ts";
import { RedisOtpStore } from "../../modules/auth/infrastructrue/otpStore/RedisOtpStore.ts";
import { NodemailerEmailService } from "../../modules/auth/infrastructrue/services/NodemailerEmailService.ts";
import type { IVerifySignupOtpUseCase } from "../../modules/auth/domain/interfaces/userCase/IVerifySignupOtpUseCase.ts";
import { VerifySignupOtpUseCase } from "../../modules/auth/application/useCase/verifySignupOtpUseCase.ts";
import { OtpConntroller } from "../../modules/auth/presentation/controllers/otpController.ts";
import { ResendSignupOtp } from "../../modules/auth/application/useCase/resendSignupOtpUseCase.ts";
import { LoginUseCase } from "../../modules/auth/application/useCase/LoginUseCase.ts";
import type { ITokenService } from "../../modules/auth/domain/interfaces/ITokenService.ts";
import type { ITokenStore } from "../../modules/auth/domain/interfaces/ITokenStore.ts";
import { JwtTokenService } from "../../modules/auth/infrastructrue/services/JwtTokenService.ts";
import { RedisTokenStore } from "../../modules/auth/infrastructrue/tokenStore/RedisTokenStore.ts";
import { RefreshUseCase } from "../../modules/auth/application/useCase/RefreshUseCase.ts";
import { LogoutUseCase } from "../../modules/auth/application/useCase/LogoutUseCase.ts";
import { SendForgotOtpUseCase } from "../../modules/auth/application/useCase/SendForgotOtpUseCase.ts";
import { ResendForgotOtpUseCase } from "../../modules/auth/application/useCase/ResendForgotOtpUseCase.ts";
import { VerifyForgotOtpUseCase } from "../../modules/auth/application/useCase/VerifyForgotOtpUseCase.ts";
import { ResetPasswordUseCase } from "../../modules/auth/application/useCase/ResetPasswordUseCase.ts";
import { ForgotPasswordController } from "../../modules/auth/presentation/controllers/forgotPasswordController.ts";
import { GoogleAuthService } from "../../modules/auth/infrastructrue/services/GoogleAuthService.ts";
import { GoogleAuthUseCase } from "../../modules/auth/application/useCase/GoogleAuthUseCase.ts";
import type { IWriteAuditLogUseCase } from "../../modules/audit-log/domain/interfaces/useCase/IWriteAuditLogUseCase.ts";

export const bindAuth = (container: Container, writeAuditLogUseCase: IWriteAuditLogUseCase) => {
  container
    .bind<IPasswordHasher>(TYPES.IPasswordHasher)
    .to(BcryptPasswordHasher)
    .inSingletonScope();

  container.bind<IEmailService>(TYPES.IEmailService).to(NodemailerEmailService).inSingletonScope();
  container.bind<IOtpStore>(TYPES.IOtpStore).to(RedisOtpStore).inSingletonScope();
  container.bind<ISignupStore>(TYPES.ISignupStore).to(RedisSignupStore).inSingletonScope();
  container.bind<ITokenService>(TYPES.ITokenService).to(JwtTokenService).inSingletonScope();
  container.bind<ITokenStore>(TYPES.ITokenStore).to(RedisTokenStore).inSingletonScope();
  const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
  const passwordHasher = container.get<IPasswordHasher>(TYPES.IPasswordHasher);
  const signupStore    = container.get<ISignupStore>(TYPES.ISignupStore);
  const otpStore       = container.get<IOtpStore>(TYPES.IOtpStore);
  const emailService   = container.get<IEmailService>(TYPES.IEmailService);
  const tokenService = container.get<ITokenService>(TYPES.ITokenService);
  const tokenStore     = container.get<ITokenStore>(TYPES.ITokenStore);

  const googleAuthService = new GoogleAuthService();
  const googleAuthUseCase = new GoogleAuthUseCase(
    userRepository,
    googleAuthService,
    tokenService,
    tokenStore,
    writeAuditLogUseCase,
  );

  const registerUseCase = new RegisterUseCase(userRepository, passwordHasher,signupStore,otpStore,emailService);
  const loginUseCase = new LoginUseCase(
    userRepository,
    passwordHasher,
    tokenService,
    tokenStore,
    writeAuditLogUseCase,
  );
  const refreshUseCase = new RefreshUseCase(tokenService, tokenStore);
  const logoutUseCase = new LogoutUseCase(tokenService, tokenStore, writeAuditLogUseCase);

  const authController = new AuthController(
    registerUseCase,
    loginUseCase,
    refreshUseCase,
    logoutUseCase,
    googleAuthUseCase,
  );

  const verifySignupOtpUseCase = new VerifySignupOtpUseCase(
    userRepository,
    otpStore,
    signupStore,
    writeAuditLogUseCase,
  );
  const resendSignupOtpUseCase = new ResendSignupOtp(signupStore,otpStore,emailService);
  const otpController = new OtpConntroller(verifySignupOtpUseCase,resendSignupOtpUseCase);

  const sendForgotOtpUseCase = new SendForgotOtpUseCase(userRepository, otpStore, emailService);
  const resendForgotOtpUseCase = new ResendForgotOtpUseCase(userRepository, otpStore, emailService);
  const verifyForgotOtpUseCase = new VerifyForgotOtpUseCase(otpStore);
  const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, otpStore, passwordHasher);
  const forgotPasswordController = new ForgotPasswordController(
    sendForgotOtpUseCase,
    resendForgotOtpUseCase,
    verifyForgotOtpUseCase,
    resetPasswordUseCase,
  );

  const authRoutes = createAuthRoutes(authController, otpController, forgotPasswordController);

  return {
    authRoutes,
  };
};
