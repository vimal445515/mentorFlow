import { api, ENDPOINTS } from "@/core/api";
import type { ApiResponse } from "@/core/types/api.types";
import type { AuditLogsPage, AuditLogsQuery } from "../types/auditLog.types";

export async function getAuditLogs(
  query: AuditLogsQuery,
  signal?: AbortSignal,
): Promise<ApiResponse<AuditLogsPage>> {
  const response = await api.get<ApiResponse<AuditLogsPage>>(
    ENDPOINTS.AUDIT_LOGS.LIST,
    { params: query, signal },
  );
  return response.data;
}
