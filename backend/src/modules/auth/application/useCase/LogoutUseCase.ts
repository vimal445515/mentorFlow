import type { ITokenService } from "../../domain/interfaces/ITokenService.ts";
import type { ITokenStore } from "../../domain/interfaces/ITokenStore.ts";
import type { ILogoutUsecase } from "../../domain/interfaces/userCase/ILogoutUseCase.ts";
import type { LogoutDto } from "../dto/LogoutDto.ts";
import type { IWriteAuditLogUseCase } from "../../../audit-log/domain/interfaces/useCase/IWriteAuditLogUseCase.ts";
import { AuditAction } from "../../../audit-log/domain/entities/AuditLog.ts";


export class LogoutUseCase implements ILogoutUsecase {
    constructor(
        private readonly tokenService:ITokenService,
        private readonly tokenStore:ITokenStore,
        private readonly writeAuditLogUseCase: IWriteAuditLogUseCase,
    ){}

    async execute(dto: LogoutDto): Promise<void> {
        const payload = await this.tokenService.verifyRefreshToken(dto.refreshToken);
        await this.tokenStore.deleteRefreshToken(payload.userId);
        await this.writeAuditLogUseCase.execute({
            actorId: payload.userId,
            action: AuditAction.LOGOUT,
            description: "User signed out.",
            resourceType: "USER",
            resourceId: payload.userId,
        });
    }
}