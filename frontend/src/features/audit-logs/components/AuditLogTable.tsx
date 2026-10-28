import type { FC } from "react";
import type { AuditLogRecord } from "../types/auditLog.types";

interface AuditLogTableProps {
  logs: AuditLogRecord[];
  isLoading: boolean;
  error: string;
  onRetry: () => void;
}

function formatAction(action: string): string {
  return action
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatFieldName(field: string): string {
  return field
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatValue(value: unknown): string {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (typeof value === "string") {
    return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
  }
  if (value === null || value === undefined) {
    return "—";
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

function getDescription(log: AuditLogRecord): string {
  if (log.description) {
    return log.description;
  }

  const actionDescriptions: Record<AuditLogRecord["action"], string> = {
    LOGIN: "User signed in.",
    LOGOUT: "User signed out.",
    USER_CREATED: "A user account was created.",
    USER_UPDATED: `A ${log.resourceType.toLowerCase().replaceAll("_", " ")} was updated.`,
  };
  return actionDescriptions[log.action];
}

function renderMetadata(metadata: AuditLogRecord["metadata"]) {
  if (!metadata || Object.keys(metadata).length === 0) {
    return <span className="text-stone-400">—</span>;
  }

  const entries = Object.entries(metadata);
  return (
    <dl className="min-w-40 space-y-1.5">
      {entries.map(([key, value]) => (
        <div key={key} className="flex flex-col gap-0.5">
          <dt className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">
            {formatFieldName(key)}
          </dt>
          <dd className="break-words text-xs text-stone-700">
            {Array.isArray(value) ? value.map(formatValue).join(", ") : formatValue(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export const AuditLogTable: FC<AuditLogTableProps> = ({
  logs,
  isLoading,
  error,
  onRetry,
}) => (
  <section
    aria-label="Audit log entries"
    className="overflow-hidden rounded-2xl border border-[#EBE6DF] bg-white shadow-xs"
  >
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[#EBE6DF] bg-stone-50/50 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
            <th scope="col" className="px-6 py-3.5">When</th>
            <th scope="col" className="px-6 py-3.5">Action</th>
            <th scope="col" className="min-w-64 px-6 py-3.5">What happened</th>
            <th scope="col" className="px-6 py-3.5">Performed by</th>
            <th scope="col" className="px-6 py-3.5">Affected record</th>
            <th scope="col" className="px-6 py-3.5">Additional details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EBE6DF] text-sm">
          {isLoading ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-stone-500">
                Loading audit logs…
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <p className="text-sm text-red-600">{error}</p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-3 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
                >
                  Try again
                </button>
              </td>
            </tr>
          ) : logs.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-stone-500">
                No audit log entries found.
              </td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log.id} className="align-top transition-colors hover:bg-stone-50/80">
                <td className="whitespace-nowrap px-6 py-4 text-xs text-stone-600">
                  <time dateTime={log.createdAt}>{formatDate(log.createdAt)}</time>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    log.action === "LOGIN" || log.action === "USER_CREATED"
                      ? "bg-emerald-50 text-emerald-700"
                      : log.action === "LOGOUT"
                        ? "bg-stone-100 text-stone-700"
                        : "bg-blue-50 text-blue-700"
                  }`}>
                    {formatAction(log.action)}
                  </span>
                </td>
                <td className="max-w-sm px-6 py-4 text-sm leading-5 text-stone-700">
                  {getDescription(log)}
                </td>
                <td className="max-w-48 break-all px-6 py-4 font-mono text-xs text-stone-600">
                  {log.actorId ? (
                    <span title={log.actorId}>{log.actorId}</span>
                  ) : (
                    <span className="font-sans text-stone-400">System</span>
                  )}
                </td>
                <td className="max-w-56 px-6 py-4 text-xs text-stone-600">
                  <span className="font-semibold text-stone-700">{formatFieldName(log.resourceType)}</span>
                  <span className="mt-1 block break-all font-mono" title={log.resourceId ?? undefined}>
                    {log.resourceId ?? "—"}
                  </span>
                </td>
                <td className="px-6 py-4">{renderMetadata(log.metadata)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </section>
);
