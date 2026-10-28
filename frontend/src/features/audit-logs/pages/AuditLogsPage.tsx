import type { FC } from "react";
import { RefreshCw } from "lucide-react";
import { AdminPagination } from "@/features/admin/components/AdminPagination";
import { AdminTopBar } from "@/features/admin/components/AdminTopBar";
import { AuditLogTable } from "../components/AuditLogTable";
import { useAuditLogs } from "../hooks/useAuditLogs";
import type { AuditAction } from "../types/auditLog.types";

const ACTIONS: AuditAction[] = [
  "LOGIN",
  "LOGOUT",
  "USER_CREATED",
  "USER_UPDATED",
];

export const AuditLogsPage: FC = () => {
  const {
    logs,
    total,
    page,
    limit,
    action,
    error,
    isLoading,
    setAction,
    setPage,
    setLimit,
    refresh,
  } = useAuditLogs();

  return (
    <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-[#F5F2EE] font-sans text-stone-900">
      <AdminTopBar actions={
        <button
          type="button"
          onClick={refresh}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-700 shadow-xs transition-colors hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      }>
        Admin <span className="mx-2 text-stone-300">/</span>{" "}
        <span className="font-semibold text-stone-900">Audit Logs</span>
      </AdminTopBar>

      <main className="flex-1 p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Audit Logs
            </h1>
            <p className="mt-0.5 text-sm text-stone-500">
              Review account sign-ins, sign-outs, and user changes.
            </p>
          </div>

          <section
            aria-label="Audit log filters"
            className="flex flex-col gap-4 rounded-2xl border border-[#EBE6DF] bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between"
          >
            <label className="flex max-w-sm flex-col gap-1.5 text-xs font-medium text-stone-600">
              Filter by action
              <select
                aria-label="Filter audit logs by action"
                value={action}
                onChange={(event) =>
                  setAction(
                    ACTIONS.includes(event.target.value as AuditAction)
                      ? (event.target.value as AuditAction)
                      : "",
                  )
                }
                className="w-full cursor-pointer rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
              >
                <option value="">All actions</option>
                {ACTIONS.map((value) => (
                  <option key={value} value={value}>
                    {value.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-xs text-stone-500">
              {total} {total === 1 ? "event" : "events"} found
            </p>
          </section>

          <AuditLogTable
            logs={logs}
            isLoading={isLoading}
            error={error}
            onRetry={refresh}
          />
          {!error && (
            <div className="overflow-hidden rounded-2xl border border-[#EBE6DF] bg-white shadow-xs">
              <AdminPagination
                page={page}
                pageSize={limit}
                total={total}
                itemLabel="events"
                onPageChange={setPage}
                onPageSizeChange={setLimit}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
