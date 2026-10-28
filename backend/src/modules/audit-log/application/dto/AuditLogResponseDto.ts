import type {
  AuditAction,
  AuditLogJsonValue,
} from "../../domain/entities/AuditLog.ts";

export interface AuditLogResponseDto {
  id: string;
  actorId: string | null;
  action: AuditAction;
  description: string | null;
  resourceType: string;
  resourceId: string | null;
  metadata: { [key: string]: AuditLogJsonValue } | null;
  createdAt: Date;
}

export interface ListAuditLogsResponseDto {
  logs: AuditLogResponseDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
