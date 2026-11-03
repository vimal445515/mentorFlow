import type { AuditLog as PrismaAuditLog, Prisma } from "@prisma/client";
import {
  AuditLog,
  type AuditLogJsonValue,
} from "../../domain/entities/AuditLog.ts";
import type { CreateAuditLogDto } from "../../application/dto/CreateAuditLogDto.ts";

export class AuditLogMapper {
  static fromDb(record: PrismaAuditLog): AuditLog {
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

  static toDb(input: CreateAuditLogDto) {
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
