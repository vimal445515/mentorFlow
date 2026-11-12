import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileTopBar } from "../../profile/components/ProfileTopBar";
// Replace with your StudentSidebar component path
import { StudentSidebar } from "../../profile/components/StudentSidebar";
import { ChannelHeader } from "../components/ChannelHeader";
import { ChannelStatsSidebar, type LearningPackItem } from "../components/ChannelStatsSidebar";
import { ChannelFeedCard } from "../components/ChannelFeedCard";
import { PostCommentsModal } from "../components/PostCommentsModal";
import { listPublicChannelPosts } from "../api/channelContentApi";
import type { ChannelContentType, ChannelPost } from "../types/channelContent.types";
import { useChannelPostLikes } from "../hooks/useChannelPostLikes";
import { getPublicChannel } from "../api/channelApi";
import type { PublicChannel } from "../types/channel.types";
import { useToast } from "@/shared/components/Toast";
import { RouteLoader } from "@/shared/components/RouteLoader";
import { FileText, Download } from "lucide-react";
import { logout } from "@/features/auth/api/authApi";
import { showAlert } from "@/shared/components/alertBox";
import { Pagination } from "@/shared/components/pagination";

type ChannelPostFilter = "ALL" | "TEXT" | "VIDEO" | "DOCUMENT";

const POSTS_PER_PAGE = 5;

function formatPostDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Recently"
    : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function postTypeLabel(type: ChannelContentType): string {
  if (type === "TEXT") return "ARTICLE / GUIDE";
  if (type === "VIDEO") return "VIDEO TUTORIAL";
  return "LEARNING RESOURCE";
}

export const StudentChannelDetailPage: FC = () => {
  const navigate = useNavigate();
  const { channelId } = useParams<{ channelId: string }>();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<ChannelPostFilter>("ALL");
  const [channel, setChannel] = useState<PublicChannel | null>(null);
  const [posts, setPosts] = useState<ChannelPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);

  // Student interactive states
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [commentPost, setCommentPost] = useState<{ postId: string; title: string } | null>(null);
  const { toggleLike, pendingPostIds } = useChannelPostLikes(setPosts, showToast);

  useEffect(() => {
    if (!channelId) return;
    const controller = new AbortController();
    setLoading(true);
    setLoadError(false);

    Promise.all([
      getPublicChannel(channelId, controller.signal),
      listPublicChannelPosts(channelId, controller.signal),
    ])
      .then(([loadedChannel, loadedPosts]) => {
        if (controller.signal.aborted) return;
        setChannel(loadedChannel);
        setPosts(loadedPosts);
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setLoadError(true);
        setLoading(false);
        showToast(
          error instanceof Error ? error.message : "Could not load channel.",
          "error",
          "Load Failed",
        );
      });

    return () => controller.abort();
  }, [channelId, showToast]);

  const filteredPosts = useMemo(
    () => posts.filter((post) => activeTab === "ALL" || post.type === activeTab),
    [activeTab, posts],
  );
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const displayPage = Math.min(currentPage, totalPages);
  const paginatedPosts = filteredPosts.slice(
    (displayPage - 1) * POSTS_PER_PAGE,
    displayPage * POSTS_PER_PAGE,
  );

  // Extract DOCUMENT posts to populate the right sidebar "Channel Learning Packs"
  const learningPacks: LearningPackItem[] = useMemo(
    () =>
      posts
        .filter((p) => p.type === "DOCUMENT" && p.fileUrl)
        .slice(0, 3)
        .map((doc) => ({
          id: doc.postId,
          title: doc.fileName || doc.title,
          subtitle: doc.subject || "PDF Resource",
          fileUrl: doc.fileUrl,
        })),
    [posts],
  );

  const tabs: { id: ChannelPostFilter; label: string; count: number }[] = [
    { id: "ALL", label: "All Content", count: posts.length },
    { id: "TEXT", label: "Posts", count: posts.filter((p) => p.type === "TEXT").length },
    { id: "VIDEO", label: "Videos", count: posts.filter((p) => p.type === "VIDEO").length },
    { id: "DOCUMENT", label: "Resources", count: posts.filter((p) => p.type === "DOCUMENT").length },
  ];

  const handleBookSession = () => {
    if (!channel) return;
    navigate(`/student/mentors/${encodeURIComponent(channel.mentorId)}/book`);
  };

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
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? error.message)
        : error instanceof Error
          ? error.message
          : "Could not log out.";
      showToast(message, "error", "Logout Failed");
    }
  }, [navigate, showToast]);

  const toggleBookmark = (postId: string) => {
    setBookmarkedPostIds((prev) => {
      const next = !prev[postId];
      showToast(next ? "Saved to your bookmarks." : "Removed from bookmarks.", "success");
      return { ...prev, [postId]: next };
    });
  };

  return (
    <div className="h-screen overflow-hidden bg-[#FAF8F5] flex flex-col font-sans text-stone-900">
      <ProfileTopBar
        role="STUDENT"
        pageTitle={`Channels / ${channel?.name ?? "Channel"}`}
        onLogout={handleLogoutClick}
        action={handleBookSession}
        actionName="Book a Session"
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <StudentSidebar activeItem="Channels" />

        <main className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto p-6 sm:p-8 max-w-7xl mx-auto space-y-6 w-full">
          {loading ? (
            <RouteLoader message="Loading channel details..." />
          ) : loadError || !channel ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-600">
              Could not load channel details. Please refresh and try again.
            </div>
          ) : (
            <>
              {/* Student Role Header */}
              <ChannelHeader
                role="STUDENT"
                channel={channel}
                mentorName={channel.mentor.fullName}
                mentorHeadline={channel.mentor.headline ?? undefined}
                mentorProfileImageUrl={channel.mentor.profileImageUrl ?? undefined}
                isMentorVerified={false}
                publishedItems={channel.postsCount}
                showFollowAction={false}
                onBookSession={handleBookSession}
              />

              {/* Terracotta Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-4">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id);
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        isActive
                          ? "bg-[#B44D29] text-white shadow-xs"
                          : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                          isActive ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Feed + Student Right Sidebar */}
              <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_15rem]">
                <div className="min-w-0 space-y-6">
                  {filteredPosts.length === 0 ? (
                    <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-600">
                      No content published in this category yet.
                    </div>
                  ) : (
                    paginatedPosts.map((post) => {
                      return (
                        <ChannelFeedCard
                          key={post.postId}
                          role="STUDENT"
                          authorName={channel.mentor.fullName}
                          authorRole={channel.mentor.headline || "Mentor"}
                          authorImageUrl={channel.mentor.profileImageUrl ?? undefined}
                          isAuthorVerified={false}
                          timestamp={formatPostDate(post.createdAt)}
                          badgeLabel={postTypeLabel(post.type)}
                          badgeColor={
                            post.type === "TEXT"
                              ? "blue"
                              : post.type === "VIDEO"
                                ? "orange"
                                : "emerald"
                          }
                          title={post.title}
                          description={post.description}
                          tags={post.tags}
                          helpTopic={post.subject || post.tags[0]}
                          likesCount={post.likesCount ?? 0}
                          commentsCount={post.commentsCount ?? 0}
                          isLiked={Boolean(post.isLiked)}
                          isLikePending={Boolean(pendingPostIds[post.postId])}
                          isBookmarked={Boolean(bookmarkedPostIds[post.postId])}
                          onToggleLike={() => void toggleLike(post)}
                          onOpenComments={() =>
                            setCommentPost({ postId: post.postId, title: post.title })
                          }
                          onToggleBookmark={() => toggleBookmark(post.postId)}
                          onBookSession={handleBookSession}
                          onShare={() => {
                            void navigator.clipboard?.writeText(window.location.href);
                            showToast("Link copied to clipboard!", "success");
                          }}
                        >
                          {post.type === "TEXT" && post.thumbnailUrl && (
                            <img
                              src={post.thumbnailUrl}
                              alt={post.thumbnailName ?? post.title}
                              className="w-full max-h-96 rounded-xl border border-stone-200 object-cover"
                            />
                          )}
                          {post.type === "TEXT" && post.content && (
                            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-xs sm:text-sm leading-relaxed text-stone-700 whitespace-pre-wrap">
                              {post.content}
                            </div>
                          )}
                          {post.type === "VIDEO" && post.fileUrl && (
                            <video
                              controls
                              preload="metadata"
                              poster={post.thumbnailUrl}
                              className="w-full rounded-xl border border-stone-200 bg-stone-900"
                            >
                              <source src={post.fileUrl} />
                            </video>
                          )}
                          {post.type === "DOCUMENT" && post.fileUrl && (
                            <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF8F5] flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-stone-900 truncate">
                                    {post.fileName ?? "Learning Resource.pdf"}
                                  </p>
                                  <p className="text-[10px] text-stone-500">{post.subject}</p>
                                </div>
                              </div>
                              <a
                                href={post.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs shrink-0"
                              >
                                <Download className="w-3.5 h-3.5 text-[#B44D29]" />
                                <span>Download</span>
                              </a>
                            </div>
                          )}
                        </ChannelFeedCard>
                      );
                    })
                  )}

                  {/* Bottom Pagination */}
                  {totalPages > 1 && (
                    <div className="rounded-2xl border border-stone-200 bg-white px-4 sm:px-6">
                      <Pagination
                        currentPage={displayPage}
                        totalPages={totalPages}
                        onPageChange={(page) =>
                          setCurrentPage(Math.min(Math.max(page, 1), totalPages))
                        }
                      />
                    </div>
                  )}
                </div>

                {/* Student Role Sidebar */}
                <ChannelStatsSidebar
                  role="STUDENT"
                  mentorName={channel.mentor.fullName}
                  mentorBio={channel.description}
                  followersCount={`${channel.mentor.followerCount.toLocaleString()} Mentor Followers`}
                  learningPacks={learningPacks}
                  onBookSession={handleBookSession}
                  onViewMentorProfile={() =>
                    navigate(`/student/mentors/${encodeURIComponent(channel.mentorId)}`)
                  }
                />
              </div>
            </>
          )}
          <PostCommentsModal
            postId={commentPost?.postId ?? null}
            postTitle={commentPost?.title ?? ""}
            isOpen={commentPost !== null}
            onClose={() => setCommentPost(null)}
            onCommentAdded={(postId) =>
              setPosts((current) =>
                current.map((post) =>
                  post.postId === postId
                    ? { ...post, commentsCount: (post.commentsCount ?? 0) + 1 }
                    : post,
                ),
              )
            }
          />
        </main>
      </div>
    </div>
  );
};
