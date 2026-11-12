import type { FC } from "react";
import type { AuditLogRecord } from "../types/auditLog.types";
import type { DataTableProps } from "@/shared/components/DataTable/types";
import { DataTable } from "@/shared/components/DataTable/DataTable";

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

const columns:DataTableProps<AuditLogRecord>['columns'] =[
  {
    id:"when",
    header:"when",
    className:"whitespace-nowrap text-xs text-stone-600",
    cell:(row)=>(
      <time dateTime={row.createdAt}>{formatDate(row.createdAt)}</time>
    )
  },


  {
    id:"action",
    header:"action",
    className:"text-xs",
    cell:(log)=>(<span
        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          log.action === "LOGIN" || log.action === "USER_CREATED"
            ? "bg-emerald-50 text-emerald-700"
            : log.action === "LOGOUT"
              ? "bg-stone-100 text-stone-700"
              : "bg-blue-50 text-blue-700"
        }`}
      >
        {formatAction(log.action)}
      </span>

    )
  },

   {
    id: "description",
    header: "What happened",
    headerClassName: "min-w-64",
    className: "max-w-sm text-sm leading-5 text-stone-700",
    cell: (log) => getDescription(log),
  },

   {
    id: "performedBy",
    header: "Performed by",
    className: "max-w-48 break-all font-mono text-xs text-stone-600",
    cell: (log) =>
      log.actorId ? (
        <span title={log.actorId}>{log.actorId}</span>
      ) : (
        <span className="font-sans text-stone-400">System</span>
      ),
  },


   {
    id: "affectedRecord",
    header: "Affected record",
    className: "max-w-56 text-xs text-stone-600",
    cell: (log) => (
      <>
        <span className="font-semibold text-stone-700">
          {formatFieldName(log.resourceType)}
        </span>

        <span
          className="mt-1 block break-all font-mono"
          title={log.resourceId ?? undefined}
        >
          {log.resourceId ?? "—"}
        </span>
      </>
    ),
  },

    {
    id: "metadata",
    header: "Additional details",
    cell: (log) => renderMetadata(log.metadata),
  },
];


export const AuditLogTable: FC<AuditLogTableProps> = ({
  logs,
  isLoading,
  error,
  onRetry,
}) =>(<section>
  <DataTable columns={columns} data={logs} getRowId={(log)=>log.id} isLoading={isLoading} error={error} onRetry={onRetry} emptyMessage="No audit log entries found." loadingMessage="Loading audit logs…" />
</section>)
