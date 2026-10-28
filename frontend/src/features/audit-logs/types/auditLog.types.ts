export type AuditAction = "LOGIN" | "LOGOUT" | "USER_CREATED" | "USER_UPDATED";

export type AuditLogJsonValue =
  | string
  | number
  | boolean
  | null
  | AuditLogJsonValue[]
  | { [key: string]: AuditLogJsonValue };

export interface AuditLogRecord {
  id: string;
  actorId: string | null;
  action: AuditAction;
  description: string | null;
  resourceType: string;
  resourceId: string | null;
  metadata: { [key: string]: AuditLogJsonValue } | null;
  createdAt: string;
}

export interface AuditLogsQuery {
  action?: AuditAction;
  resourceType?: string;
  page: number;
  limit: number;
}

export interface AuditLogsPage {
  logs: AuditLogRecord[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
