import { AppError } from "../../../../shared/errors/appError.ts";
import { HttpStatusCode } from "../../../../shared/constant/HttpStatusCode.ts";
import type { IUserManagementRepository } from "../../domain/repositories/IUserManagementRepository.ts";
import type { IWriteAuditLogUseCase } from "../../../audit-log/domain/interfaces/useCase/IWriteAuditLogUseCase.ts";
import { AuditAction } from "../../../audit-log/domain/entities/AuditLog.ts";
import type { IUpdateUserStatusUseCase } from "../../domain/interfaces/useCase/IUpdateUserStatusUseCase.ts";
import type { UserResponseDto } from "../dto/UserResponseDto.ts";
import type { UserStatus } from "../../domain/enums/UserStatus.ts";
import { UserMapper } from "../mappers/UserMapper.ts";

export class UpdateUserStatusUseCase implements IUpdateUserStatusUseCase {
  constructor(
    private readonly userRepository: IUserManagementRepository,
    private readonly writeAuditLogUseCase: IWriteAuditLogUseCase,
  ) {}

  async execute(
    userId: string,
    status: Extract<UserStatus, "ACTIVE" | "SUSPENDED">,
    actorId: string,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.updateStatus(userId, status);
    if (!user) {
      throw new AppError("User not found.", HttpStatusCode.NOT_FOUND);
    }
    await this.writeAuditLogUseCase.execute({
      actorId,
      action: AuditAction.USER_UPDATED,
      description: `Admin changed the user's account status to ${status.toLowerCase()}.`,
      resourceType: "USER",
      resourceId: userId,
      metadata: { updatedFields: ["status"], status },
    });
    return UserMapper.toUserDto(user);
  }
}
