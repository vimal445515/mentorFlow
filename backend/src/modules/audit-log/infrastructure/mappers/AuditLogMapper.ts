import type { AuditLog as PrismaAuditLog, Prisma } from "@prisma/client";
import {
  AuditLog,
  type AuditLogJsonValue,
} from "../../domain/entities/AuditLog.ts";
import type { AuditLogResponseDto } from "../../application/dto/AuditLogResponseDto.ts";
import type { CreateAuditLogDto } from "../../application/dto/CreateAuditLogDto.ts";

export class AuditLogMapper {
  static toDomain(record: PrismaAuditLog): AuditLog {
    return new AuditLog({
      id: record.id,
      actorId: record.actorId,
      action: record.action as AuditLog["action"],
      description: record.description,
      resourceType: record.resourceType,
      resourceId: record.resourceId,
      metadata: AuditLogMapper.toMetadata(record.metadata),
      createdAt: record.createdAt,
    });
  }

  static toPersistence(input: CreateAuditLogDto) {
    return {
      actorId: input.actorId,
      action: input.action,
      description: input.description,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      ...(input.metadata && {
        metadata: input.metadata as Prisma.InputJsonObject,
      }),
    };
  }

  static toResponseDto(entity: AuditLog): AuditLogResponseDto {
    return {
      id: entity.id,
      actorId: entity.actorId,
      action: entity.action,
      description: entity.description,
      resourceType: entity.resourceType,
      resourceId: entity.resourceId,
      metadata: entity.metadata,
      createdAt: entity.createdAt,
    };
  }

  private static toMetadata(
    metadata: Prisma.JsonValue,
  ): { [key: string]: AuditLogJsonValue } | null {
    if (
      metadata === null ||
      Array.isArray(metadata) ||
      typeof metadata !== "object"
    ) {
      return null;
    }

    return metadata as { [key: string]: AuditLogJsonValue };
  }
}
