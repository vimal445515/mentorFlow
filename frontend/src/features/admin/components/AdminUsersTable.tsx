import type { FC } from "react";
import { Ban, CheckCircle2 } from "lucide-react";
import { DataTable } from "@/shared/components/DataTable/DataTable";
import type { DataTableProps } from "@/shared/components/DataTable/types";
import { AdminPagination } from "./AdminPagination";
import type { ManagedUser } from "../types/user.types";

interface AdminUsersTableProps {
  users: ManagedUser[];
  isLoading: boolean;
  error: string;
  updatingUserId: string | null;
  page: number;
  pageSize: number;
  total: number;
  onStatusChange: (user: ManagedUser) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

function formatStatus(status: ManagedUser["status"]): string {
  return status.replaceAll("_", " ");
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export const AdminUsersTable: FC<AdminUsersTableProps> = ({
  users,
  isLoading,
  error,
  updatingUserId,
  page,
  pageSize,
  total,
  onStatusChange,
  onPageChange,
  onPageSizeChange,
}) => {
  const columns: DataTableProps<ManagedUser>["columns"] = [
    {
      id: "user",
      header: "User",
      cell: (user) => (
        <div className="flex items-center gap-3">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt=""
              className="h-9 w-9 shrink-0 rounded-full border border-stone-200 object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FDF0EC] text-sm font-semibold text-[#C85A32]">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <p className="font-semibold leading-tight text-stone-900">{user.fullName}</p>
        </div>
      ),
    },
    {
      id: "email",
      header: "Email",
      className: "text-stone-600",
      cell: (user) => user.email,
    },
    {
      id: "role",
      header: "Role",
      cell: (user) => (
        <span className="inline-flex rounded-md border border-emerald-200/50 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          {user.role === "STUDENT" ? "Student" : "Mentor"}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (user) => (
        <span
          className={`inline-flex rounded-md border px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${
            user.status === "ACTIVE"
              ? "border-emerald-200 bg-emerald-50 text-emerald-600"
              : user.status === "SUSPENDED"
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {formatStatus(user.status)}
        </span>
      ),
    },
    {
      id: "joined",
      header: "Joined",
      className: "whitespace-nowrap text-xs text-stone-500",
      cell: (user) => formatDate(user.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (user) => (
        <button
          type="button"
          disabled={updatingUserId !== null}
          onClick={() => onStatusChange(user)}
          className={`inline-flex items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-xs font-medium shadow-xs transition-colors disabled:cursor-wait disabled:opacity-50 ${
            user.status !== "SUSPENDED"
              ? "border-red-200 text-red-600 hover:bg-red-50"
              : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
          }`}
        >
          {user.status !== "SUSPENDED" ? (
            <>
              <Ban size={13} />
              {updatingUserId === user.id ? "Updating…" : "Suspend"}
            </>
          ) : (
            <>
              <CheckCircle2 size={13} />
              {updatingUserId === user.id ? "Updating…" : "Activate"}
            </>
          )}
        </button>
      ),
    },
  ];

  return (
    <section aria-label="Users">
      <DataTable
        columns={columns}
        data={users}
        getRowId={(user) => user.id}
        isLoading={isLoading}
        error={error}
        emptyMessage="No users match your search and filters."
        loadingMessage="Loading users…"
        footer={
          <AdminPagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        }
      />
    </section>
  );
};
