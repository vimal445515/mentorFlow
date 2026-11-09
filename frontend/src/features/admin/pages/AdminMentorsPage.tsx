import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type FC,
} from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { isAxiosError } from "axios";
import { AdminMentorsTable } from "../components/AdminMentorsTable";
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

          <AdminMentorsTable
            mentors={mentorsPage.mentors}
            isLoading={isLoading}
            error={loadError}
            updatingMentorId={updatingMentorId}
            page={page}
            pageSize={pageSize}
            total={mentorsPage.total}
            onView={(mentorId) => navigate(`/admin/mentors/${mentorId}`)}
            onApprovalDecision={(mentor, decision) => void handleApprovalDecision(mentor, decision)}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </main>

    </div>
  );
};
