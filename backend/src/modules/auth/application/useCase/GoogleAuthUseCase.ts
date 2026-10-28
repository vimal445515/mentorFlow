import type { GoogleAuthDto } from "../dto/GoogleAuthDto.ts";
import type { IUserRepository } from "../../domain/repositories/IUserRepository.ts";
import type { ITokenStore } from "../../domain/interfaces/ITokenStore.ts";
import type { ITokenService } from "../../domain/interfaces/ITokenService.ts";
import type { IGoogleAuthService } from "../../domain/interfaces/IGoogleAuthService.ts";
import { UserRole } from "../../domain/enums/UserRole.ts";
import { User } from "../../domain/entities/User.ts";
import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import type { IGoogleAuthUseCase } from "../../domain/interfaces/userCase/IGoogleAuthUseCase.ts";
import type { LoginResponse } from "../../domain/interfaces/userCase/ILoginUseCase.ts";
import type { IWriteAuditLogUseCase } from "../../../audit-log/domain/interfaces/useCase/IWriteAuditLogUseCase.ts";
import { AuditAction } from "../../../audit-log/domain/entities/AuditLog.ts";

export class GoogleAuthUseCase implements IGoogleAuthUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly googleAuthService: IGoogleAuthService,
    private readonly tokenService: ITokenService,
    private readonly tokenStore: ITokenStore,
    private readonly writeAuditLogUseCase: IWriteAuditLogUseCase,
  ) {}

  async execute(dto: GoogleAuthDto): Promise<LoginResponse> {
    const googleProfile = await this.googleAuthService.verifyToken(
      dto.credential,
    );

    let user = await this.userRepository.findByEmailAndRole(
      googleProfile.email,
      dto.role,
    );

    if (!user) {
      user = await this.userRepository.findByGoogleIdAndRole(
        googleProfile.googleId,
        dto.role,
      );
    }

    let isNewUser = false;
    if (user) {
      if (user.status === "SUSPENDED") {
        throw new AppError(
          "Account has been suspended. Please contact support.",
          HttpStatusCode.FORBIDDEN,
        );
      }

      const needsGoogleIdUpdate =
        !user.googleId || user.googleId !== googleProfile.googleId;
      const needsImageUpdate =
        (!user.profileImageUrl || user.profileImageUrl === "") &&
        Boolean(googleProfile.profileImageUrl);

      if (needsGoogleIdUpdate || needsImageUpdate) {
        if (needsGoogleIdUpdate) user.googleId = googleProfile.googleId;
        if (needsImageUpdate && googleProfile.profileImageUrl)
          user.profileImageUrl = googleProfile.profileImageUrl;
        user = await this.userRepository.update(user.id!, user);
      }
    } else {
      const newUser = new User({
        fullName: googleProfile.fullName,
        email: googleProfile.email,
        role: dto.role,
        profileImageUrl: googleProfile.profileImageUrl || "",
        googleId: googleProfile.googleId,
        passwordHash: null,
        status: "ACTIVE",
      });
      user = await this.userRepository.create(newUser);
      isNewUser = true;
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
      action: isNewUser ? AuditAction.USER_CREATED : AuditAction.LOGIN,
      description: isNewUser
        ? `A new ${user.role.toLowerCase()} account was created using Google sign-in.`
        : `User signed in with Google as ${user.role.toLowerCase()}.`,
      resourceType: "USER",
      resourceId: user.id!,
      metadata: {
        role: user.role,
        provider: "GOOGLE",
      },
    });

    return {
      user: {
        id: user.id!,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }
}
