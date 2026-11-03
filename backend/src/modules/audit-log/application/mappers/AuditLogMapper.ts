import type { AuditLog } from "../../domain/entities/AuditLog.ts";
import type { AuditLogResponseDto } from "../dto/AuditLogResponseDto.ts";

export class AuditLogMapper {
  static toDto(log: AuditLog): AuditLogResponseDto {
    return {
      id: log.id,
      actorId: log.actorId,
      action: log.action,
      description: log.description,
      resourceType: log.resourceType,
      resourceId: log.resourceId,
      metadata: log.metadata,
      createdAt: log.createdAt,
    };
  }
}
