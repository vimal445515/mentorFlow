import { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { getAuditLogs } from "../api/auditLogApi";
import type {
  AuditAction,
  AuditLogsPage,
  AuditLogsQuery,
} from "../types/auditLog.types";

const EMPTY_PAGE: AuditLogsPage = {
  logs: [],
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

function getErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? error.message;
  }
  return error instanceof Error ? error.message : "Could not load audit logs.";
}

export function useAuditLogs() {
  const [action, setAction] = useState<AuditAction | "">("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [auditLogsPage, setAuditLogsPage] = useState<AuditLogsPage>(EMPTY_PAGE);
  const [loadedRequestKey, setLoadedRequestKey] = useState("");
  const [error, setError] = useState("");

  const query = useMemo<AuditLogsQuery>(
    () => ({
      action: action || undefined,
      page,
      limit,
    }),
    [action, page, limit],
  );
  const requestKey = `${JSON.stringify(query)}:${refreshVersion}`;
  const isLoading = loadedRequestKey !== requestKey;

  useEffect(() => {
    const controller = new AbortController();
    getAuditLogs(query, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) {
          return;
        }
        if (!response.data || !Array.isArray(response.data.logs)) {
          throw new Error(response.message || "Unexpected audit log response.");
        }
        setAuditLogsPage(response.data);
        setError("");
        setLoadedRequestKey(requestKey);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(getErrorMessage(requestError));
          setLoadedRequestKey(requestKey);
        }
      });

    return () => controller.abort();
  }, [query, requestKey]);

  const updateAction = (nextAction: AuditAction | "") => {
    setAction(nextAction);
    setPage(1);
    setError("");
  };

  const updatePage = (nextPage: number) => {
    setPage(nextPage);
    setError("");
  };

  const updateLimit = (nextLimit: number) => {
    setLimit(nextLimit);
    setPage(1);
    setError("");
  };

  const refresh = () => setRefreshVersion((version) => version + 1);

  return {
    logs: auditLogsPage.logs,
    total: auditLogsPage.total,
    page,
    limit,
    action,
    error,
    isLoading,
    setAction: updateAction,
    setPage: updatePage,
    setLimit: updateLimit,
    refresh,
  };
}
