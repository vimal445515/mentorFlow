import type { FC } from "react";
import { CheckCircle2, Eye, XCircle } from "lucide-react";
import { DataTable } from "@/shared/components/DataTable/DataTable";
import type { DataTableProps } from "@/shared/components/DataTable/types";
import { AdminPagination } from "./AdminPagination";
import type { ManagedMentor } from "../types/mentor.types";
import type { ManagedUserStatus } from "../types/user.types";

interface AdminMentorsTableProps {
  mentors: ManagedMentor[];
  isLoading: boolean;
  error: string;
  updatingMentorId: string | null;
  page: number;
  pageSize: number;
  total: number;
  onView: (mentorId: string) => void;
  onApprovalDecision: (mentor: ManagedMentor, decision: "APPROVE" | "REJECT") => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

function formatStatus(status: ManagedUserStatus): string {
  return status.replaceAll("_", " ");
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function StatusBadge({ status }: { status: ManagedUserStatus }) {
  const classes =
    status === "ACTIVE" || status === "APPROVED"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "SUSPENDED"
        ? "border-red-200 bg-red-50 text-red-600"
        : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <span className={`inline-flex rounded-md border px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${classes}`}>
      {formatStatus(status)}
    </span>
  );
}

export const AdminMentorsTable: FC<AdminMentorsTableProps> = ({
  mentors,
  isLoading,
  error,
  updatingMentorId,
  page,
  pageSize,
  total,
  onView,
  onApprovalDecision,
  onPageChange,
  onPageSizeChange,
}) => {
  const columns: DataTableProps<ManagedMentor>["columns"] = [
    {
      id: "mentor",
      header: "Mentor",
      cell: (mentor) => (
        <div className="flex min-w-52 items-center gap-3">
          {mentor.profileImageUrl ? (
            <img
              src={mentor.profileImageUrl}
              alt=""
              className="h-10 w-10 shrink-0 rounded-full border border-stone-200 object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FDF0EC] font-semibold text-[#C85A32]">
              {mentor.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold leading-tight text-stone-900">{mentor.fullName}</p>
            <p className="mt-0.5 max-w-48 truncate text-xs text-stone-500">{mentor.email}</p>
          </div>
        </div>
      ),
    },
    {
      id: "skills",
      header: "Skills",
      cell: (mentor) => {
        const skills = mentor.skills.length
          ? mentor.skills
          : (mentor.teachingSubjects?.split(",").map((skill) => skill.trim()).filter(Boolean) ?? []);

        return (
          <div className="flex max-w-56 flex-wrap gap-1">
            {skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] text-stone-600"
              >
                {skill}
              </span>
            ))}
            {!skills.length && <span className="text-xs text-stone-400">Not provided</span>}
            {skills.length > 3 && (
              <span className="px-1 text-[11px] text-stone-400">+{skills.length - 3}</span>
            )}
          </div>
        );
      },
    },
    {
      id: "experience",
      header: "Experience",
      cell: (mentor) => (
        <>
          <p className="max-w-48 font-medium text-stone-700">
            {mentor.headline || mentor.latestExperience || "Not provided"}
          </p>
          <p className="mt-1 text-xs text-stone-500">
            {mentor.yearsExperience} {mentor.yearsExperience === 1 ? "year" : "years"}
          </p>
        </>
      ),
    },
    {
      id: "price",
      header: "Session Price",
      className: "whitespace-nowrap font-medium text-stone-700",
      cell: (mentor) => `${formatPrice(mentor.sessionPrice)} / hr`,
    },
    {
      id: "verification",
      header: "Verification",
      cell: (mentor) => <StatusBadge status={mentor.verificationStatus} />,
    },
    {
      id: "status",
      header: "Status",
      cell: (mentor) => <StatusBadge status={mentor.status} />,
    },
    {
      id: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (mentor) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onView(mentor.id)}
            aria-label={`View ${mentor.fullName} details`}
            title="View details"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-600 transition-colors hover:bg-stone-50"
          >
            <Eye size={14} />
          </button>
          {(mentor.verificationStatus === "PENDING_APPROVAL" ||
            mentor.verificationStatus === "APPROVED") && (
            <>
              {mentor.verificationStatus === "PENDING_APPROVAL" && (
                <button
                  type="button"
                  disabled={updatingMentorId !== null}
                  onClick={() => onApprovalDecision(mentor, "APPROVE")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-2.5 py-1.5 text-xs font-medium text-emerald-700 shadow-xs transition-colors hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-50"
                >
                  <CheckCircle2 size={13} />
                  {updatingMentorId === mentor.id ? "Updating…" : "Verify"}
                </button>
              )}
              <button
                type="button"
                disabled={updatingMentorId !== null}
                onClick={() => onApprovalDecision(mentor, "REJECT")}
                aria-label={`Reject ${mentor.fullName}'s verification`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-700 shadow-xs transition-colors hover:bg-red-50 disabled:cursor-wait disabled:opacity-50"
              >
                <XCircle size={13} />
                {updatingMentorId === mentor.id
                  ? "Updating…"
                  : mentor.verificationStatus === "APPROVED"
                    ? "Revoke"
                    : "Reject"}
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <section aria-label="Mentor list">
      <DataTable
        columns={columns}
        data={mentors}
        getRowId={(mentor) => mentor.id}
        isLoading={isLoading}
        error={error}
        emptyMessage="No mentors match your search and filters."
        loadingMessage="Loading mentors…"
        footer={
          <AdminPagination
            page={page}
            pageSize={pageSize}
            total={total}
            itemLabel="mentors"
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        }
      />
    </section>
  );
};
