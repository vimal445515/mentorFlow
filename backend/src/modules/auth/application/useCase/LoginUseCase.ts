import type { LoginDto } from "../dto/LoginDto.ts";
import type { IUserRepository } from "../../domain/repositories/IUserRepository.ts";
import type { IPasswordHasher } from "../../domain/interfaces/IPasswordHasher.ts";
import type { ITokenStore } from "../../domain/interfaces/ITokenStore.ts";
import type { ITokenService } from "../../domain/interfaces/ITokenService.ts";
import { UserRole } from "../../domain/enums/UserRole.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import type {
  ILoginUseCase,
  LoginResponse,
} from "../../domain/interfaces/userCase/ILoginUseCase.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import { ErrorMessages } from "../../../../shared/constant/ErrorMessage.ts";
import type { IWriteAuditLogUseCase } from "../../../audit-log/domain/interfaces/useCase/IWriteAuditLogUseCase.ts";
import { AuditAction } from "../../../audit-log/domain/entities/AuditLog.ts";

export class LoginUseCase implements ILoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
    private readonly tokenStore: ITokenStore,
    private readonly writeAuditLogUseCase: IWriteAuditLogUseCase,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmailAndRole(
      dto.email,
      dto.role,
    );

    if (!user) {
      throw new AppError("User not found", HttpStatusCode.NOT_FOUND);
    }

    if (user.role !== dto.role) {
      throw new AppError("Unauthorized role!", HttpStatusCode.UNAUTHORIZED);
    }

    if (!user.passwordHash) {
      throw new AppError(
        "This account was created with Google Sign-In. Please continue with Google.",
        HttpStatusCode.BAD_REQUEST
      );
    }

    if(user.status === "SUSPENDED" ){
      throw new AppError("Account suspended",HttpStatusCode.FORBIDDEN);
    }

    const isPasswordValid = await this.passwordHasher.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new AppError(
        ErrorMessages.INVALID_EMAIL_OR_PASSWORD,
        HttpStatusCode.UNAUTHORIZED,
      );
    }

    const payload = {
      userId: user.id!,
      email: user.email,
      role: user.role as UserRole,
    };

    const accessToken = await this.tokenService.generateAccessToken(payload);
    const refreshToken = await this.tokenService.generateRefreshToken(payload);

    await this.tokenStore.saveRefreshToken(user.id!, refreshToken);
    await this.writeAuditLogUseCase.execute({
      actorId: user.id!,
      action: AuditAction.LOGIN,
      description: `User signed in with password as ${user.role.toLowerCase()}.`,
      resourceType: "USER",
      resourceId: user.id!,
      metadata: { role: user.role },
    });

    return {
      user: {
        id: user.id!,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImageUrl: user.profileImageUrl,
      },
      accessToken,
      refreshToken,
    };
  }
}
