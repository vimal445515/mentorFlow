import type { CreateAuditLogDto } from "../../application/dto/CreateAuditLogDto.ts";
import type { ListAuditLogsDto } from "../../application/dto/ListAuditLogsDto.ts";
import type { AuditLog } from "../entities/AuditLog.ts";

export interface AuditLogSearchResult {
  logs: AuditLog[];
  total: number;
}

export interface IAuditLogRepository {
  create(input: CreateAuditLogDto): Promise<void>;
  findMany(filters: ListAuditLogsDto): Promise<AuditLogSearchResult>;
}
