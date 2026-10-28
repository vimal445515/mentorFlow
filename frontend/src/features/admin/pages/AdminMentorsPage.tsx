import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type FC,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Eye,
  Search,
  XCircle,
} from "lucide-react";
import { isAxiosError } from "axios";
import { AdminPagination } from "../components/AdminPagination";
import { AdminTopBar } from "../components/AdminTopBar";
import { approveMentor, getMentors, rejectMentor } from "../api/mentorApi";
import type {
  ManagedMentor,
  MentorListParams,
  PaginatedMentors,
} from "../types/mentor.types";
import type { ManagedUserStatus } from "../types/user.types";
import { useToast } from "@/shared/components/Toast";
import { showAlert } from "@/shared/components/alertBox";

const EMPTY_RESULT: PaginatedMentors = {
  mentors: [],
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
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

export const AdminMentorsPage: FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [mentorsPage, setMentorsPage] = useState<PaginatedMentors>(EMPTY_RESULT);
  const [searchInput, setSearchInput] = useState("");
  const search = useDeferredValue(searchInput.trim());
  const [accountStatus, setAccountStatus] = useState<ManagedUserStatus | "">("");
  const [verificationStatus, setVerificationStatus] = useState<ManagedUserStatus | "">("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loadedRequestKey, setLoadedRequestKey] = useState("");
  const [loadError, setLoadError] = useState("");
  const [updatingMentorId, setUpdatingMentorId] = useState<string | null>(null);

  const params = useMemo<MentorListParams>(
    () => ({
      search: search || undefined,
      status: accountStatus || undefined,
      verificationStatus: verificationStatus || undefined,
      page,
      limit: pageSize,
    }),
    [search, accountStatus, verificationStatus, page, pageSize],
  );
  const requestKey = `${JSON.stringify(params)}:${refreshKey}`;
  const isLoading = loadedRequestKey !== requestKey;

  useEffect(() => {
    const controller = new AbortController();
    getMentors(params, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) {
          return;
        }
        if (!response.data) {
          throw new Error(response.message || "The mentor list response was empty.");
        }
        setMentorsPage(response.data);
        setLoadError("");
        setLoadedRequestKey(requestKey);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setLoadError(getErrorMessage(error, "Could not load mentors."));
          setLoadedRequestKey(requestKey);
        }
      });
    return () => controller.abort();
  }, [params, requestKey]);

  const reload = () => {
    setLoadError("");
    setRefreshKey((previousKey) => previousKey + 1);
  };

  const handleApprovalDecision = async (
    mentor: ManagedMentor,
    decision: "APPROVE" | "REJECT",
  ) => {
    const isApproval = decision === "APPROVE";
    const isRevoking = !isApproval && mentor.verificationStatus === "APPROVED";
    const confirmation = await showAlert(
      "ADMIN",
      isApproval
        ? "Approve mentor?"
        : isRevoking
          ? "Revoke mentor verification?"
          : "Reject verification request?",
      isApproval
        ? `Approve ${mentor.fullName} as a verified mentor?`
        : isRevoking
          ? `Revoke ${mentor.fullName}'s verified status? Their verification status will return to active.`
          : `Reject ${mentor.fullName}'s verification request? Their verification status will return to active.`,
      "question",
      isApproval ? "Approve" : "Reject",
      "Cancel",
    );
    if (!confirmation.isConfirmed) {
      return;
    }

    setUpdatingMentorId(mentor.id);
    try {
      if (isApproval) {
        await approveMentor(mentor.id);
      } else {
        await rejectMentor(mentor.id);
      }
      showToast(
        isApproval
          ? `${mentor.fullName} has been verified.`
          : isRevoking
            ? `${mentor.fullName}'s verification was revoked.`
            : `${mentor.fullName}'s verification request was rejected.`,
        "success",
      );
      reload();
    } catch (error) {
      showToast(
        getErrorMessage(
          error,
          isApproval
            ? "Could not verify mentor."
            : isRevoking
              ? "Could not revoke mentor verification."
              : "Could not reject verification request.",
        ),
        "error",
        isApproval ? "Verification Failed" : isRevoking ? "Revocation Failed" : "Rejection Failed",
      );
    } finally {
      setUpdatingMentorId(null);
    }
  };

  const changeFilters = (update: () => void) => {
    setLoadError("");
    update();
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    setLoadError("");
    setPage(nextPage);
  };

  const handlePageSizeChange = (size: number) => {
    setLoadError("");
    setPageSize(size);
    setPage(1);
  };

  return (
    <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-[#F5F2EE] font-sans text-stone-900">
      <AdminTopBar>
        Admin <span className="mx-2 text-stone-300">/</span>{" "}
        <span className="font-semibold text-stone-900">Mentors</span>
      </AdminTopBar>

      <main className="flex-1 p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">Mentors</h1>
            <p className="mt-0.5 text-sm text-stone-500">
              Review mentor profiles, verification, and account status.
            </p>
          </div>

          <section
            aria-label="Mentor filters"
            className="grid grid-cols-1 gap-4 rounded-2xl border border-[#EBE6DF] bg-white p-6 shadow-xs lg:grid-cols-3"
          >
            <label className="relative flex items-center lg:col-span-1">
              <Search size={18} className="absolute left-4 text-stone-400" />
              <input
                type="search"
                aria-label="Search mentors"
                placeholder="Search name, email, or specialty..."
                value={searchInput}
                onChange={(event) => {
                  setSearchInput(event.target.value);
                  setLoadError("");
                  setPage(1);
                }}
                className="w-full rounded-xl border border-stone-200 bg-stone-50/50 py-3 pl-11 pr-4 text-sm text-stone-900 placeholder-stone-400 focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
              />
            </label>

            <select
              aria-label="Filter by account status"
              value={accountStatus}
              onChange={(event) => {
                const value = event.target.value;
                changeFilters(() =>
                  setAccountStatus(
                    value === "ACTIVE" || value === "SUSPENDED" ? value : "",
                  ),
                );
              }}
              className="w-full cursor-pointer rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
            >
              <option value="">All Account Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
            </select>

            <select
              aria-label="Filter by verification status"
              value={verificationStatus}
              onChange={(event) => {
                const value = event.target.value;
                changeFilters(() => {
                  if (value === "APPROVED" || value === "PENDING_APPROVAL") {
                    setVerificationStatus(value);
                  } else {
                    setVerificationStatus("");
                  }
                });
              }}
              className="w-full cursor-pointer rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
            >
              <option value="">All Verification States</option>
              <option value="PENDING_APPROVAL">Pending Verification</option>
              <option value="APPROVED">Verified</option>
            </select>
          </section>

          <section
            aria-label="Mentor list"
            className="overflow-hidden rounded-2xl border border-[#EBE6DF] bg-white shadow-xs"
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#EBE6DF] bg-stone-50/50 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                    <th scope="col" className="px-6 py-3.5">Mentor</th>
                    <th scope="col" className="px-6 py-3.5">Skills</th>
                    <th scope="col" className="px-6 py-3.5">Experience</th>
                    <th scope="col" className="px-6 py-3.5">Session Price</th>
                    <th scope="col" className="px-6 py-3.5">Verification</th>
                    <th scope="col" className="px-6 py-3.5">Status</th>
                    <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE6DF] text-sm">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-sm text-stone-500">
                        Loading mentors…
                      </td>
                    </tr>
                  ) : loadError ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-sm text-red-600">
                        {loadError}
                      </td>
                    </tr>
                  ) : mentorsPage.mentors.length ? (
                    mentorsPage.mentors.map((mentor) => (
                      <tr key={mentor.id} className="transition-colors hover:bg-stone-50/80">
                        <td className="px-6 py-4">
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
                              <p className="font-semibold leading-tight text-stone-900">
                                {mentor.fullName}
                              </p>
                              <p className="mt-0.5 max-w-48 truncate text-xs text-stone-500">
                                {mentor.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex max-w-56 flex-wrap gap-1">
                            {(mentor.skills.length
                              ? mentor.skills
                              : (mentor.teachingSubjects?.split(",").map((skill) => skill.trim()).filter(Boolean) ?? [])
                            ).slice(0, 3).map((skill) => (
                              <span
                                key={skill}
                                className="rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 text-[11px] text-stone-600"
                              >
                                {skill}
                              </span>
                            ))}
                            {!mentor.skills.length && !mentor.teachingSubjects && (
                              <span className="text-xs text-stone-400">Not provided</span>
                            )}
                            {mentor.skills.length > 3 && (
                              <span className="px-1 text-[11px] text-stone-400">
                                +{mentor.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="max-w-48 font-medium text-stone-700">
                            {mentor.headline || mentor.latestExperience || "Not provided"}
                          </p>
                          <p className="mt-1 text-xs text-stone-500">
                            {mentor.yearsExperience} {mentor.yearsExperience === 1 ? "year" : "years"}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-stone-700">
                          {formatPrice(mentor.sessionPrice)} / hr
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={mentor.verificationStatus} />
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={mentor.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/mentors/${mentor.id}`)}
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
                                    onClick={() => void handleApprovalDecision(mentor, "APPROVE")}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-2.5 py-1.5 text-xs font-medium text-emerald-700 shadow-xs transition-colors hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-50"
                                  >
                                    <CheckCircle2 size={13} />
                                    {updatingMentorId === mentor.id ? "Updating…" : "Verify"}
                                  </button>
                                )}
                                <button
                                  type="button"
                                  disabled={updatingMentorId !== null}
                                  onClick={() => void handleApprovalDecision(mentor, "REJECT")}
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
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-sm text-stone-500">
                        No mentors match your search and filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <AdminPagination
              page={page}
              pageSize={pageSize}
              total={mentorsPage.total}
              itemLabel="mentors"
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </section>
        </div>
      </main>

    </div>
  );
};
