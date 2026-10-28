export const AUTH_TYPES = {
  IRegisterUseCase: Symbol.for("IRegisterUseCase"),
  IUserRepository: Symbol.for("IUserRepository"),
  IPasswordHasher: Symbol.for("IPasswordHasher"),
  IAuthController: Symbol.for("IAuthController"),
  ITokenService: Symbol.for("ITokenService"),

  IEmailService: Symbol.for("IEmailService"),

  IOtpStore: Symbol.for("IOtpStore"),
  ISignupStore: Symbol.for("ISignupStore"),
  ITokenStore: Symbol.for("ITokenStore"),
};
