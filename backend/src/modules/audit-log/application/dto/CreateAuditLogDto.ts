import type {
  AuditAction,
  AuditLogJsonValue,
} from "../../domain/entities/AuditLog.ts";

export interface CreateAuditLogDto {
  actorId: string;
  action: AuditAction;
  description: string;
  resourceType: string;
  resourceId: string;
  metadata?: { [key: string]: AuditLogJsonValue };
}
