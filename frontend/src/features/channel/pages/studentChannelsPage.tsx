import { useCallback, useEffect, useState, type FC } from "react";
import axios from "axios";
import { ArrowRight, FileText, MessageSquare, Search, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "@/features/auth/api/authApi";
import { ProfileTopBar } from "@/features/profile/components/ProfileTopBar";
import { StudentSidebar } from "@/features/profile/components/StudentSidebar";
import { Pagination } from "@/shared/components/pagination";
import { RouteLoader } from "@/shared/components/RouteLoader";
import { showAlert } from "@/shared/components/alertBox";
import { useToast } from "@/shared/components/Toast";
import { listPublicChannels } from "../api/channelApi";
import type { PublicChannel } from "../types/channel.types";

const CHANNELS_PER_PAGE = 6;

const CARD_THEMES = {
  peach: {
    banner: "from-[#FBEBE4] to-[#FDF6F3]",
    avatar: "bg-[#FBEBE4] text-[#B44D29]",
  },
  green: {
    banner: "from-[#E2F3EA] to-[#F3FAF6]",
    avatar: "bg-[#E2F3EA] text-[#1E7B4F]",
  },
  gold: {
    banner: "from-[#FDF2CE] to-[#FEF9EA]",
    avatar: "bg-[#FDF2CE] text-[#9A6B16]",
  },
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

function getCardTheme(index: number) {
  if (index % 3 === 1) return CARD_THEMES.green;
  if (index % 3 === 2) return CARD_THEMES.gold;
  return CARD_THEMES.peach;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatRelativeTime(value: string): string {
  const difference = new Date(value).getTime() - Date.now();
  if (Number.isNaN(difference)) return "Date unavailable";
  if (Math.abs(difference) < 60_000) return "just now";

  const intervals: [number, Intl.RelativeTimeFormatUnit][] = [
    [365 * 24 * 60 * 60 * 1000, "year"],
    [30 * 24 * 60 * 60 * 1000, "month"],
    [7 * 24 * 60 * 60 * 1000, "week"],
    [24 * 60 * 60 * 1000, "day"],
    [60 * 60 * 1000, "hour"],
    [60 * 1000, "minute"],
  ];
  const [milliseconds, unit] =
    intervals.find(([duration]) => Math.abs(difference) >= duration) ?? intervals[5];
  return new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }).format(
    Math.round(difference / milliseconds),
    unit,
  );
}

export const StudentChannelsPage: FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [channels, setChannels] = useState<PublicChannel[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalChannels, setTotalChannels] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);
    return () => window.clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();

    void listPublicChannels(
      {
        page: currentPage,
        limit: CHANNELS_PER_PAGE,
        search: debouncedSearch || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      controller.signal,
    )
      .then((result) => {
        if (controller.signal.aborted) return;
        const pageCount = Math.max(1, result.pagination.totalPages);
        setChannels(result.channels);
        setTotalChannels(result.pagination.total);
        setTotalPages(pageCount);
        if (currentPage > pageCount) {
          setIsLoading(true);
          setCurrentPage(pageCount);
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setLoadError(getErrorMessage(error, "Could not load channels."));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [currentPage, debouncedSearch, reloadKey]);

  const handleLogoutClick = useCallback(async () => {
    const confirmation = await showAlert(
      "STUDENT",
      "Log out?",
      "Are you sure you want to log out of this account?",
      "question",
      "Log out",
      "Cancel",
    );
    if (!confirmation.isConfirmed) return;

    try {
      await logout();
      showToast("Logged out successfully.", "info");
      navigate("/student-login");
    } catch (error) {
      showToast(getErrorMessage(error, "Could not log out."), "error", "Logout Failed");
    }
  }, [navigate, showToast]);

  const firstItem = totalChannels === 0 ? 0 : (currentPage - 1) * CHANNELS_PER_PAGE + 1;
  const lastItem = Math.min(currentPage * CHANNELS_PER_PAGE, totalChannels);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    setIsLoading(true);
    setLoadError(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F5F0] font-sans text-[#1F1E1C]">
      <ProfileTopBar role="STUDENT" pageTitle="Channels" onLogout={handleLogoutClick} />

      <div className="flex flex-1">
        <StudentSidebar activeItem="Channels" />

        <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-6 py-8 sm:px-8">
          <header className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-[#1F1E1C]">
              Mentor Knowledge Channels
            </h1>
            <p className="mt-1 text-sm text-[#6B6760]">
              Explore mentor feeds, technical deep dives, and architecture case studies.
            </p>
          </header>

          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B6760]">
            <p>
              Showing{" "}
              <span className="font-semibold text-[#1F1E1C]">
                {firstItem}&ndash;{lastItem}
              </span>{" "}
              of <span className="font-semibold text-[#1F1E1C]">{totalChannels}</span> channels
            </p>
            <p className="text-[#8A857D]">Published mentor channels</p>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <label className="relative block">
              <Search
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C776F]"
              />
              <input
                type="search"
                aria-label="Search channels"
                value={search}
                onChange={(event) => {
                  const nextSearch = event.target.value;
                  setSearch(nextSearch);
                  setCurrentPage(1);
                  if (nextSearch.trim() !== debouncedSearch || currentPage !== 1) {
                    setIsLoading(true);
                    setLoadError(null);
                  } else {
                    setIsLoading(false);
                  }
                }}
                placeholder="Search public channels by name..."
                className="w-full rounded-xl border border-[#E5E0D8] bg-white py-2.5 pl-10 pr-4 text-xs text-[#1F1E1C] placeholder:text-[#8A857D] focus:border-[#B44D29] focus:outline-none focus:ring-2 focus:ring-[#B44D29]/20"
              />
            </label>
          </div>

          {isLoading ? (
            <RouteLoader message="Loading channels..." />
          ) : loadError ? (
            <section
              role="alert"
              className="rounded-2xl border border-rose-200 bg-white p-6 text-sm text-rose-800"
            >
              <p>{loadError}</p>
              <button
                type="button"
                onClick={() => {
                  setIsLoading(true);
                  setLoadError(null);
                  setReloadKey((value) => value + 1);
                }}
                className="mt-3 rounded-lg bg-rose-50 px-3 py-2 font-semibold text-rose-800 hover:bg-rose-100"
              >
                Try again
              </button>
            </section>
          ) : channels.length === 0 ? (
            <section className="rounded-2xl border border-[#EAE6DF] bg-white p-8 text-center">
              <h2 className="font-semibold text-[#1F1E1C]">No channels found</h2>
              <p className="mt-1 text-sm text-[#6B6760]">
                {debouncedSearch
                  ? "Try a different search term."
                  : "There are no published channels to display yet."}
              </p>
            </section>
          ) : (
            <>
              <section
                aria-label="Published channels"
                className="grid grid-cols-1 gap-6 lg:grid-cols-3"
              >
                {channels.map((channel, index) => {
                  const theme = getCardTheme(index);
                  return (
                    <article
                      key={channel.channelId}
                      className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#EAE6DF] bg-white shadow-2xs transition-shadow hover:shadow-md"
                    >
                      <div>
                        <div
                          className={`relative flex h-24 items-start justify-end bg-gradient-to-b p-4 ${theme.banner}`}
                        >
                          <span className="rounded-full border border-[#C6EBD8] bg-[#E6F6EE] px-2.5 py-0.5 text-[11px] font-medium text-[#1E7B4F]">
                            Public
                          </span>
                        </div>

                        <div className="relative -mt-7 px-6 pb-5">
                          {channel.mentor.profileImageUrl ? (
                            <img
                              src={channel.mentor.profileImageUrl}
                              alt={channel.mentor.fullName}
                              referrerPolicy="no-referrer"
                              className="mb-3 h-12 w-12 rounded-full border-2 border-white object-cover shadow-2xs"
                            />
                          ) : (
                            <div
                              className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white text-sm font-bold shadow-2xs ${theme.avatar}`}
                              aria-label={`${channel.mentor.fullName} initials`}
                            >
                              {getInitials(channel.mentor.fullName)}
                            </div>
                          )}

                          <h2 className="text-base font-bold leading-snug text-[#1F1E1C]">
                            {channel.name}
                          </h2>
                          <p className="mt-1 text-xs text-[#8A857D]">
                            By {channel.mentor.fullName}
                            {channel.mentor.headline && ` • ${channel.mentor.headline}`}
                          </p>
                          <p className="mt-2 text-xs font-semibold text-[#524E48]">
                            {channel.topic}
                          </p>
                          <p className="mt-3 line-clamp-4 text-xs leading-relaxed text-[#524E48]">
                            {channel.description || "No description provided."}
                          </p>

                          <div className="mb-4 mt-4 rounded-xl border border-[#F0EDE6] bg-[#FAF9F6] p-3">
                            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-[#3A3733]">
                              <FileText className="h-3.5 w-3.5 text-[#6B6760]" />
                              <span>Latest Post:</span>
                            </div>
                            {channel.latestPost ? (
                              <p className="text-[11px] leading-snug text-[#6B6760]">
                                {channel.latestPost.title}{" "}
                                <span className="text-[#8A857D]">
                                  • {formatRelativeTime(channel.latestPost.publishedAt)}
                                </span>
                              </p>
                            ) : (
                              <p className="text-[11px] leading-snug text-[#8A857D]">
                                No published posts yet.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="px-6 pb-6">
                        <div className="mb-4 flex items-center justify-between gap-3 text-[11px] text-[#6B6760]">
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-[#8A857D]" />
                            <span>
                              {channel.mentor.followerCount.toLocaleString()} Mentor Followers
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5 text-[#8A857D]" />
                            <span>{channel.postsCount} Posts</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            disabled
                            title="Channel entry is not available yet"
                            className="flex-1 cursor-not-allowed rounded-full bg-[#B44D29] px-4 py-2.5 text-xs font-semibold text-white opacity-70"
                          >
                            <span>Enter Channel</span>
                            <ArrowRight aria-hidden="true" className="ml-1.5 inline h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </section>

              {totalPages > 1 && (
                <div className="mt-6 rounded-2xl border border-[#EAE6DF] bg-white px-6 py-3.5">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentChannelsPage;
