import type { AuditAction } from "../../domain/entities/AuditLog.ts";

export interface ListAuditLogsDto {
  action?: AuditAction;
  resourceType?: string;
  page: number;
  limit: number;
}
