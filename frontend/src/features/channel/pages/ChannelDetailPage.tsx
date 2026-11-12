import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileTopBar } from "../../profile/components/ProfileTopBar";
import { MentorSidebar } from "../../profile/components/MentorSidebar";
import { ChannelHeader } from "../components/ChannelHeader";
import { ChannelStatsSidebar } from "../components/ChannelStatsSidebar";
import { ChannelFeedCard } from "../components/ChannelFeedCard";
import { PostCommentsModal } from "../components/PostCommentsModal";
import { listChannelPosts, deleteChannelPost } from "../api/channelContentApi";
import type { ChannelContentType, ChannelPost } from "../types/channelContent.types";
import { useChannelPostLikes } from "../hooks/useChannelPostLikes";
import { useToast } from "@/shared/components/Toast";
import { useMentorLogout } from "@/shared/hooks/useMentorLogout";
import { RouteLoader } from "@/shared/components/RouteLoader";
import { showAlert } from "@/shared/components/alertBox";
import { FileText, Download } from "lucide-react";
import { getProfile } from "@/features/profile/api/profileApi";
import type { MentorProfileData, StudentProfileData } from "@/features/profile/types/profile.types";
import { useAppSelector } from "@/app/store/hooks";
import { getChannel } from "../api/channelApi";
import type { Channel } from "../types/channel.types";

type ChannelPostFilter = "ALL" | "TEXT" | "VIDEO" | "DOCUMENT";

function isMentorProfile(
  profile: StudentProfileData | MentorProfileData,
): profile is MentorProfileData {
  return profile.role === "MENTOR";
}

function formatPostDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Recently"
    : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function postTypeLabel(type: ChannelContentType): string {
  if (type === "TEXT") return "Text / Article";
  if (type === "VIDEO") return "Video";
  return "PDF / Document";
}

export const ChannelDetailPage: FC = () => {
  const navigate = useNavigate();
  const { channelId } = useParams<{ channelId: string }>();
  const handleLogoutClick = useMentorLogout();
  const { showToast } = useToast();
  const authUser = useAppSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState<ChannelPostFilter>("ALL");
  const [channel, setChannel] = useState<Channel | null>(null);
  const [posts, setPosts] = useState<ChannelPost[]>([]);
  const [mentorProfile, setMentorProfile] = useState<MentorProfileData | null>(null);
  const [channelLoadErrorKey, setChannelLoadErrorKey] = useState<string | null>(null);
  const [settledRequestKey, setSettledRequestKey] = useState("");
  const [loadErrorKey, setLoadErrorKey] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [commentPost, setCommentPost] = useState<{ postId: string; title: string } | null>(null);
  const { toggleLike, pendingPostIds } = useChannelPostLikes(setPosts, showToast);
  const requestKey = channelId ? `${channelId}:${reloadKey}` : "";
  const loading = Boolean(channelId) && settledRequestKey !== requestKey;
  const loadError = !channelId || loadErrorKey === requestKey;
  const channelLoadError = channelLoadErrorKey === requestKey;
  const createContentPath = channelId
    ? `/mentor/channel/${encodeURIComponent(channelId)}/create-content`
    : "/mentor/channel/create-content";

  useEffect(() => {
    let isMounted = true;

    void getProfile()
      .then(({ data }) => {
        if (isMounted && data && isMentorProfile(data)) {
          setMentorProfile(data);
        }
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        showToast(
          error instanceof Error ? error.message : "Could not load mentor details.",
          "error",
          "Profile Load Failed",
        );
      });

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  useEffect(() => {
    if (!channelId) return;

    const controller = new AbortController();
    setChannel(null);
    setChannelLoadErrorKey(null);
    void getChannel(channelId, controller.signal)
      .then((loadedChannel) => {
        if (!controller.signal.aborted) setChannel(loadedChannel);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        showToast(
          error instanceof Error ? error.message : "Could not load channel details.",
          "error",
          "Channel Load Failed",
        );
        setChannelLoadErrorKey(requestKey);
      });

    void listChannelPosts(channelId, controller.signal)
      .then((loadedPosts) => {
        setPosts(loadedPosts);
        setLoadErrorKey(null);
        setSettledRequestKey(requestKey);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setLoadErrorKey(requestKey);
        showToast(
          error instanceof Error ? error.message : "Could not load channel posts.",
          "error",
          "Load Failed",
        );
        setSettledRequestKey(requestKey);
      });

    return () => controller.abort();
  }, [channelId, requestKey, showToast]);

  const filteredPosts = useMemo(
    () => posts.filter((post) => activeTab === "ALL" || post.type === activeTab),
    [activeTab, posts],
  );
  const tabs: { id: ChannelPostFilter; label: string; count: number }[] = [
    { id: "ALL", label: "All", count: posts.length },
    ...(["TEXT", "VIDEO", "DOCUMENT"] as const).map((type) => ({
      id: type,
      label: type === "TEXT" ? "Articles" : type === "VIDEO" ? "Videos" : "Documents",
      count: posts.filter((post) => post.type === type).length,
    })),
  ];

  const handleDelete = useCallback(
    async (post: ChannelPost) => {
      const result = await showAlert(
        "MENTOR",
        "Delete this post?",
        "This will permanently delete the post and its uploaded files.",
        "warning",
        "Delete post",
        "Cancel",
      );
      if (!result.isConfirmed) return;

      setDeletingPostId(post.postId);
      try {
        await deleteChannelPost(post.postId);
        setPosts((current) => current.filter((item) => item.postId !== post.postId));
        showToast("Channel post deleted successfully.", "success");
      } catch (error: unknown) {
        showToast(
          error instanceof Error ? error.message : "Could not delete the channel post.",
          "error",
          "Delete Failed",
        );
      } finally {
        setDeletingPostId(null);
      }
    },
    [showToast],
  );

  const handleEdit = (post: ChannelPost) => {
    if (!channelId) return;
    navigate(
      `/mentor/channel/${encodeURIComponent(channelId)}/posts/${encodeURIComponent(post.postId)}/edit`,
    );
  };

  return (
    <div className="h-screen overflow-hidden bg-[#FAF8F5] flex flex-col font-sans text-stone-900">
      <ProfileTopBar
        role="MENTOR"
        pageTitle={`Channels / ${channel?.name ?? "Channel"}`}
        onLogout={handleLogoutClick}
        action={() => navigate(createContentPath)}
        actionName="Create Content"
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <MentorSidebar activeItem="Channel" />
        <main className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto p-6 sm:p-10 max-w-7xl mx-auto space-y-8 w-full">
          {channel ? (
            <ChannelHeader
              channel={channel}
              mentorName={mentorProfile?.fullName || authUser?.fullName || "Mentor"}
              mentorHeadline={mentorProfile?.headline}
              mentorProfileImageUrl={mentorProfile?.profileImageUrl || authUser?.profileImageUrl}
              isMentorVerified={mentorProfile?.verificationStatus === "APPROVED"}
              yearsExperience={mentorProfile?.yearsExperience || undefined}
              publishedItems={posts.length}
              onOpenCreateModal={() => navigate(createContentPath)}
            />
          ) : channelLoadError ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-600">
              <p>Channel details could not be loaded.</p>
              <button
                type="button"
                onClick={() => setReloadKey((value) => value + 1)}
                className="mt-3 font-semibold text-[#3D6946] underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <RouteLoader message="Loading channel details..." />
          )}

          <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#3D6946] text-white shadow-xs"
                    : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1 space-y-6 w-full">
              {loading && <RouteLoader message="Loading channel posts..." />}
              {!loading && loadError && (
                <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-600">
                  <p>Channel posts could not be loaded.</p>
                  <button
                    type="button"
                    onClick={() => setReloadKey((value) => value + 1)}
                    className="mt-3 font-semibold text-[#3D6946] underline"
                  >
                    Try again
                  </button>
                </div>
              )}
              {!loading && !loadError && filteredPosts.length === 0 && (
                <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-600">
                  {posts.length === 0
                    ? "No channel posts yet. Create your first post to share it with learners."
                    : "There are no posts in this category."}
                </div>
              )}
              {!loading &&
                !loadError &&
                filteredPosts.map((post) => (
                  <ChannelFeedCard
                    key={post.postId}
                    authorName={mentorProfile?.fullName || authUser?.fullName || "Mentor"}
                    authorRole={mentorProfile?.headline || "Mentor"}
                    authorImageUrl={mentorProfile?.profileImageUrl || authUser?.profileImageUrl}
                    isAuthorVerified={mentorProfile?.verificationStatus === "APPROVED"}
                    timestamp={formatPostDate(post.createdAt)}
                    badgeLabel={postTypeLabel(post.type)}
                    badgeColor={
                      post.type === "TEXT" ? "emerald" : post.type === "VIDEO" ? "orange" : "purple"
                    }
                    title={post.title}
                    description={
                      post.type === "VIDEO" && post.category
                        ? `${post.description ?? ""}\nCategory: ${post.category}`
                        : post.type === "DOCUMENT"
                          ? post.description
                          : undefined
                    }
                    tags={post.tags}
                    likesCount={post.likesCount ?? 0}
                    commentsCount={post.commentsCount ?? 0}
                    isLiked={Boolean(post.isLiked)}
                    isLikePending={Boolean(pendingPostIds[post.postId])}
                    onToggleLike={() => void toggleLike(post)}
                    onOpenComments={() =>
                      setCommentPost({ postId: post.postId, title: post.title })
                    }
                    onEdit={() => handleEdit(post)}
                    onDelete={() => void handleDelete(post)}
                    isDeleting={deletingPostId === post.postId}
                  >
                    {post.type === "TEXT" && post.thumbnailUrl && (
                      <img
                        src={post.thumbnailUrl}
                        alt={post.thumbnailName ?? `${post.title} thumbnail`}
                        className="w-full max-h-96 rounded-xl border border-stone-200 object-cover"
                      />
                    )}
                    {post.type === "TEXT" && post.content && (
                      <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm leading-relaxed text-stone-700 whitespace-pre-wrap">
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
                        Your browser does not support video playback.
                      </video>
                    )}
                    {post.type === "DOCUMENT" && post.fileUrl && (
                      <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF8F5] flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                            {post.thumbnailUrl ? (
                              <img
                                src={post.thumbnailUrl}
                                alt={post.thumbnailName ?? ""}
                                className="h-full w-full rounded-xl object-cover"
                              />
                            ) : (
                              <FileText className="w-5 h-5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-stone-900 truncate">
                              {post.fileName ?? "PDF document"}
                            </p>
                            <p className="text-[10px] text-stone-500">{post.subject}</p>
                          </div>
                        </div>
                        <a
                          href={post.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs shrink-0"
                        >
                          <Download className="w-3.5 h-3.5 text-[#3D6946]" />
                          <span>Open PDF</span>
                        </a>
                      </div>
                    )}
                  </ChannelFeedCard>
                ))}
            </div>
            <ChannelStatsSidebar />
          </div>
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
