import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type FC,
} from "react";
import {
  Ban,
  CheckCircle2,
  Search,
} from "lucide-react";
import { isAxiosError } from "axios";
import { useToast } from "@/shared/components/Toast";
import { AdminPagination } from "../components/AdminPagination";
import { AdminTopBar } from "../components/AdminTopBar";
import { getUsers, updateUserStatus } from "../api/userApi";
import {showAlert} from "@/shared/components/alertBox.ts" 
import type {
  ManagedUser,
  ManagedUserRole,
  ManagedUserStatus,
  PaginatedUsers,
  UserListParams,
} from "../types/user.types";

const EMPTY_RESULT: PaginatedUsers = {
  users: [],
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

const currentYear = new Date().getFullYear();
const joinYears = Array.from({ length: 5 }, (_, index) => currentYear - index);

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

function formatStatus(status: ManagedUserStatus): string {
  return status.replaceAll("_", " ");
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export const AdminUsersPage: FC = () => {
  const { showToast } = useToast();
  const [usersPage, setUsersPage] = useState<PaginatedUsers>(EMPTY_RESULT);
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDeferredValue(searchInput.trim());
  const [roleFilter, setRoleFilter] = useState<ManagedUserRole | "">("");
  const [statusFilter, setStatusFilter] = useState<ManagedUserStatus | "">("");
  const [yearFilter, setYearFilter] = useState<number | "">("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loadedRequestKey, setLoadedRequestKey] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");

  const params = useMemo<UserListParams>(
    () => ({
      search: searchQuery || undefined,
      role: roleFilter || undefined,
      status: statusFilter || undefined,
      year: yearFilter || undefined,
      page,
      limit: pageSize,
    }),
    [searchQuery, roleFilter, statusFilter, yearFilter, page, pageSize],
  );
  const requestKey = `${JSON.stringify(params)}:${refreshKey}`;
  const isLoading = loadedRequestKey !== requestKey;

  useEffect(() => {
    const controller = new AbortController();
    getUsers(params, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) {
          return;
        }
        if (!response.data) {
          throw new Error(response.message || "The user list response was empty.");
        }
        setUsersPage(response.data);
        setLoadError("");
        setLoadedRequestKey(requestKey);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setLoadError(getErrorMessage(error, "Could not load users."));
          setLoadedRequestKey(requestKey);
        }
      });
    return () => controller.abort();
  }, [params, requestKey]);

  const handleStatusChange = async (user: ManagedUser) => {
    const nextStatus = user.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    const action = await showAlert("ADMIN",`${nextStatus} User`,`Do you want to ${nextStatus} this user?`,"question","OK","Cancel");
    if(!action.isConfirmed){
      setUpdatingUserId(null);
      return 
    } ;
    setUpdatingUserId(user.id);
    try {
      await updateUserStatus(user.id, nextStatus);
      showToast(
        `${user.fullName} is now ${nextStatus === "ACTIVE" ? "active" : "suspended"}.`,
        "success",
      );
      setLoadError("");
      setRefreshKey((previousKey) => previousKey + 1);
    } catch (error) {
      showToast(getErrorMessage(error, "Could not update user status."), "error", "Update Failed");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const setFilterAndResetPage = (update: () => void) => {
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
        <span className="font-semibold text-stone-900">Users</span>
      </AdminTopBar>

      <main className="flex-1 p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">Users</h1>
            <p className="mt-0.5 text-sm text-stone-500">
              Search, filter, and manage student and mentor accounts.
            </p>
          </div>

          <section
            aria-label="User filters"
            className="space-y-4 rounded-2xl border border-[#EBE6DF] bg-white p-6 shadow-xs"
          >
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <label className="relative flex items-center">
                <Search size={18} className="absolute left-4 text-stone-400" />
                <input
                  type="search"
                  aria-label="Search users"
                  placeholder="Search users by name or email..."
                  value={searchInput}
                  onChange={(event) => {
                    setSearchInput(event.target.value);
                    setLoadError("");
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/50 py-3 pl-11 pr-4 text-sm text-stone-900 placeholder-stone-400 focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
                />
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <select
                  aria-label="Filter by role"
                  value={roleFilter}
                  onChange={(event) => {
                    const value = event.target.value;
                    setFilterAndResetPage(() =>
                      setRoleFilter(value === "STUDENT" || value === "MENTOR" ? value : ""),
                    );
                  }}
                  className="w-full cursor-pointer rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
                >
                  <option value="">All Roles</option>
                  <option value="STUDENT">Student</option>
                  <option value="MENTOR">Mentor</option>
                </select>
                <select
                  aria-label="Filter by status"
                  value={statusFilter}
                  onChange={(event) => {
                    const value = event.target.value;
                    setFilterAndResetPage(() => {
                      if (
                        value === "ACTIVE" ||
                        value === "SUSPENDED" ||
                        value === "PENDING_APPROVAL" ||
                        value === "APPROVED"
                      ) {
                        setStatusFilter(value);
                      } else {
                        setStatusFilter("");
                      }
                    });
                  }}
                  className="w-full cursor-pointer rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
                >
                  <option value="">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="PENDING_APPROVAL">Pending Approval</option>
                  <option value="APPROVED">Approved</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2">
              <label className="sr-only" htmlFor="joined-year-filter">Filter by join year</label>
              <select
                id="joined-year-filter"
                aria-label="Filter by join year"
                value={yearFilter}
                onChange={(event) =>
                  setFilterAndResetPage(() =>
                    setYearFilter(event.target.value ? Number(event.target.value) : ""),
                  )
                }
                className="w-full cursor-pointer rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
              >
                <option value="">All Time</option>
                {joinYears.map((year) => (
                  <option key={year} value={year}>
                    Joined {year}
                  </option>
                ))}
              </select>
              <div className="flex items-center text-xs text-stone-500">
                {usersPage.total} {usersPage.total === 1 ? "account" : "accounts"} match the current filters
              </div>
            </div>
          </section>

          <section
            aria-label="Users"
            className="overflow-hidden rounded-2xl border border-[#EBE6DF] bg-white shadow-xs"
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#EBE6DF] bg-stone-50/50 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                    <th scope="col" className="px-6 py-3.5">User</th>
                    <th scope="col" className="px-6 py-3.5">Email</th>
                    <th scope="col" className="px-6 py-3.5">Role</th>
                    <th scope="col" className="px-6 py-3.5">Status</th>
                    <th scope="col" className="px-6 py-3.5">Joined</th>
                    <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE6DF] text-sm">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-stone-500">
                        Loading users…
                      </td>
                    </tr>
                  ) : loadError ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-red-600">
                        {loadError}
                      </td>
                    </tr>
                  ) : usersPage.users.length ? (
                    usersPage.users.map((user) => (
                      <tr key={user.id} className="transition-colors hover:bg-stone-50/80">
                        <td className="px-6 py-4">
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
                            <div className="min-w-0">
                              <p className="font-semibold leading-tight text-stone-900">
                                {user.fullName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-stone-600">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-md border border-emerald-200/50 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                            {user.role === "STUDENT" ? "Student" : "Mentor"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
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
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-xs text-stone-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            disabled={updatingUserId !== null}
                            onClick={() => void handleStatusChange(user)}
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
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-stone-500">
                        No users match your search and filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <AdminPagination
              page={page}
              pageSize={pageSize}
              total={usersPage.total}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </section>
        </div>
      </main>
    </div>
  );
};
