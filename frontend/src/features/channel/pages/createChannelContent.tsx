import { useEffect, useState, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, FileText, Video, BookOpen } from "lucide-react";
import { ProfileTopBar } from "../../profile/components/ProfileTopBar";
import { MentorSidebar } from "../../profile/components/MentorSidebar";
import { TextArticleForm } from "../components/TextArticleForm";
import { VideoForm } from "../components/VideoForm";
import { PdfDocumentForm } from "../components/PdfDocumentForm";
import { createChannelPost, listChannelPosts, updateChannelPost } from "../api/channelContentApi";
import type {
  ChannelPost,
  CreateChannelPostInput,
  TextArticlePostInput,
  UpdateChannelPostInput,
} from "../types/channelContent.types";
import { useToast } from "@/shared/components/Toast";
import { useMentorLogout } from "@/shared/hooks/useMentorLogout";
import { RouteLoader } from "@/shared/components/RouteLoader";

function parseTags(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export const CreateChannelContentPage: FC = () => {
  const navigate = useNavigate();
  const { channelId, postId } = useParams<{ channelId: string; postId: string }>();
  const handleLogoutClick = useMentorLogout();
  const { showToast } = useToast();
  const isEditing = Boolean(postId);
  const channelDetailsPath = channelId
    ? `/mentor/channel/${encodeURIComponent(channelId)}`
    : "/mentor/channel";
  const handleBackToChannel = () => navigate(channelDetailsPath);

  const [contentType, setContentType] = useState<"TEXT" | "VIDEO" | "DOCUMENT">("TEXT");
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [existingPost, setExistingPost] = useState<ChannelPost | null>(null);
  const [loadedPostId, setLoadedPostId] = useState<string | null>(null);
  const loadingPost = isEditing && loadedPostId !== postId;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Backend Engineering");
  const [subject, setSubject] = useState("");
  const [tags, setTags] = useState("");
  const [articleThumbnail, setArticleThumbnail] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoThumbnail, setVideoThumbnail] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentThumbnail, setDocumentThumbnail] = useState<File | null>(null);

  useEffect(() => {
    if (!isEditing || !postId || !channelId) return;
    const controller = new AbortController();

    void listChannelPosts(channelId, controller.signal)
      .then((posts) => {
        const post = posts.find((item) => item.postId === postId);
        if (!post) throw new Error("Channel post not found.");
        setExistingPost(post);
        setContentType(post.type);
        setTitle(post.title);
        setContent(post.content ?? "");
        setDescription(post.description ?? "");
        setCategory(post.category ?? "");
        setSubject(post.subject ?? "");
        setTags(post.tags.join(", "));
        setLoadedPostId(post.postId);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        showToast(
          error instanceof Error ? error.message : "Could not load this channel post.",
          "error",
        );
        navigate(channelDetailsPath);
      });

    return () => controller.abort();
  }, [channelDetailsPath, channelId, isEditing, navigate, postId, showToast]);

  const handlePublish = async () => {
    if (!title.trim()) {
      showToast("Please provide a title for the content", "error");
      return;
    }
    if (!channelId) {
      showToast("Open a channel before publishing content.", "error");
      return;
    }

    setSaving(true);
    setUploadProgress(0);
    try {
      const base = { title: title.trim(), tags: parseTags(tags) };
      if (contentType === "TEXT") {
        if (!content.trim()) {
          showToast("Please provide article content.", "error");
          return;
        }
        const input: TextArticlePostInput = {
          ...base,
          type: "TEXT",
          content: content.trim(),
          thumbnail: articleThumbnail ?? undefined,
        };
        if (isEditing && postId) {
          await updateChannelPost(postId, input, setUploadProgress);
        } else {
          await createChannelPost(channelId, input, setUploadProgress);
        }
      } else if (contentType === "VIDEO") {
        if (!description.trim() || !category.trim() || (!videoFile && !isEditing)) {
          showToast("Please complete the video details and select a video file.", "error");
          return;
        }
        if (videoFile && videoFile.size > 2 * 1024 * 1024 * 1024) {
          showToast("The video file must be 2 GB or smaller.", "error");
          return;
        }
        const updateInput: UpdateChannelPostInput = {
          ...base,
          type: "VIDEO",
          description: description.trim(),
          category: category.trim(),
          ...(videoFile ? { file: videoFile } : {}),
          thumbnail: videoThumbnail ?? undefined,
        };
        if (isEditing && postId) {
          await updateChannelPost(postId, updateInput, setUploadProgress);
        } else if (videoFile) {
          const createInput: CreateChannelPostInput = {
            ...updateInput,
            file: videoFile,
          };
          await createChannelPost(channelId, createInput, setUploadProgress);
        }
      } else {
        if (!description.trim() || !subject.trim() || (!documentFile && !isEditing)) {
          showToast("Please complete the document details and select a PDF file.", "error");
          return;
        }
        if (documentFile && documentFile.size > 50 * 1024 * 1024) {
          showToast("The document file must be 50 MB or smaller.", "error");
          return;
        }
        const updateInput: UpdateChannelPostInput = {
          ...base,
          type: "DOCUMENT",
          description: description.trim(),
          subject: subject.trim(),
          ...(documentFile ? { file: documentFile } : {}),
          thumbnail: documentThumbnail ?? undefined,
        };
        if (isEditing && postId) {
          await updateChannelPost(postId, updateInput, setUploadProgress);
        } else if (documentFile) {
          const createInput: CreateChannelPostInput = {
            ...updateInput,
            file: documentFile,
          };
          await createChannelPost(channelId, createInput, setUploadProgress);
        }
      }

      showToast(
        isEditing
          ? "Channel content updated successfully!"
          : "Channel content published successfully!",
        "success",
        isEditing ? "Updated" : "Published",
      );
      navigate(channelDetailsPath);
    } catch (error: unknown) {
      showToast(
        error instanceof Error ? error.message : "Failed to save channel content.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const existingAssets = existingPost
    ? [
        existingPost.fileUrl
          ? { label: existingPost.fileName ?? "Current media file", url: existingPost.fileUrl }
          : null,
        existingPost.thumbnailUrl
          ? {
              label: existingPost.thumbnailName ?? "Current thumbnail",
              url: existingPost.thumbnailUrl,
            }
          : null,
      ].filter((asset): asset is { label: string; url: string } => asset !== null)
    : [];

  return (
    <div className="h-screen overflow-hidden bg-[#FAF8F5] flex flex-col font-sans text-stone-900">
      <ProfileTopBar
        role="MENTOR"
        pageTitle={`Channels / Backend Engineering Insider / ${isEditing ? "Edit" : "Create"} Channel Content`}
        onLogout={handleLogoutClick}
        action={handleBackToChannel}
        actionName="Back to Channel"
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <MentorSidebar activeItem="Channel" />
        <main className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto p-6 sm:p-10 max-w-5xl mx-auto space-y-6 w-full">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#3D6946]">
              <span className="bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                CHANNEL CREATOR STUDIO
              </span>
              <span className="text-stone-400">•</span>
              <span className="text-stone-600">Backend Engineering Insider</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
              {isEditing ? "Edit Channel Content" : "Create Channel Content"}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Share knowledge, resources, videos, and updates with your learners.
            </p>
          </div>

          {loadingPost ? (
            <RouteLoader message="Loading post details..." />
          ) : (
            <>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                  {isEditing ? "Content type (cannot be changed)" : "What do you want to share?"}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      id: "TEXT" as const,
                      title: "Text / Article",
                      details: "Tutorials, mental models, code explanations & deep dives.",
                      Icon: FileText,
                      color: "emerald",
                    },
                    {
                      id: "VIDEO" as const,
                      title: "Video",
                      details: "Upload educational video walkthroughs & coding screencasts.",
                      Icon: Video,
                      color: "orange",
                    },
                    {
                      id: "DOCUMENT" as const,
                      title: "PDF / Document",
                      details: "Syllabus PDFs, cheat sheets & AI Knowledge Base material.",
                      Icon: BookOpen,
                      color: "purple",
                    },
                  ].map(({ id, title: optionTitle, details, Icon, color }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        if (!isEditing) setContentType(id);
                      }}
                      disabled={isEditing && id !== contentType}
                      aria-pressed={contentType === id}
                      className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                        contentType === id
                          ? "border-[#3D6946] bg-white ring-1 ring-[#3D6946] shadow-xs"
                          : "border-stone-200 bg-white"
                      } ${
                        isEditing && id !== contentType
                          ? "cursor-not-allowed opacity-60"
                          : isEditing
                            ? "cursor-default"
                            : "cursor-pointer hover:border-stone-300"
                      }`}
                    >
                      {contentType === id && (
                        <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#3D6946]" />
                      )}
                      <div className="space-y-3">
                        <div
                          className={`w-10 h-10 rounded-xl ${
                            color === "emerald"
                              ? "bg-emerald-50 text-[#3D6946]"
                              : color === "orange"
                                ? "bg-orange-50 text-orange-600"
                                : "bg-purple-50 text-purple-600"
                          } flex items-center justify-center font-bold`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-stone-900">{optionTitle}</h4>
                          <p className="text-xs text-stone-500 mt-1">{details}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {existingAssets.length > 0 && (
                <div className="rounded-xl border border-stone-200 bg-white p-4 text-sm">
                  <p className="mb-2 font-semibold text-stone-700">
                    Current files (kept unless replaced)
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {existingAssets.map((asset) => (
                      <a
                        key={asset.url}
                        href={asset.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#3D6946] underline"
                      >
                        {asset.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {contentType === "TEXT" && (
                <TextArticleForm
                  title={title}
                  setTitle={setTitle}
                  content={content}
                  setContent={setContent}
                  tags={tags}
                  setTags={setTags}
                  thumbnailFile={articleThumbnail}
                  setThumbnailFile={setArticleThumbnail}
                />
              )}
              {contentType === "VIDEO" && (
                <VideoForm
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                  category={category}
                  setCategory={setCategory}
                  tags={tags}
                  setTags={setTags}
                  videoFile={videoFile}
                  setVideoFile={setVideoFile}
                  thumbnailFile={videoThumbnail}
                  setThumbnailFile={setVideoThumbnail}
                  isEditing={isEditing}
                />
              )}
              {contentType === "DOCUMENT" && (
                <PdfDocumentForm
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                  subject={subject}
                  setSubject={setSubject}
                  tags={tags}
                  setTags={setTags}
                  documentFile={documentFile}
                  setDocumentFile={setDocumentFile}
                  thumbnailFile={documentThumbnail}
                  setThumbnailFile={setDocumentThumbnail}
                  isEditing={isEditing}
                />
              )}

              <div className="pt-4 flex items-center justify-between border-t border-stone-200">
                <button
                  type="button"
                  onClick={handleBackToChannel}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm font-semibold hover:bg-stone-50 transition-colors cursor-pointer shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={saving || loadingPost}
                  className="px-6 py-2.5 rounded-xl bg-[#3D6946] hover:bg-[#32573a] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {saving
                      ? uploadProgress > 0
                        ? `Uploading ${uploadProgress}%...`
                        : isEditing
                          ? "Saving..."
                          : "Publishing..."
                      : isEditing
                        ? "Save Changes"
                        : "Publish Content"}
                  </span>
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};
