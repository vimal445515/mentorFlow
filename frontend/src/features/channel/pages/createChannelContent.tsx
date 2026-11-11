import { useState, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, FileText, Video, BookOpen } from "lucide-react";
import { ProfileTopBar } from "../../profile/components/ProfileTopBar";
import { MentorSidebar } from "../../profile/components/MentorSidebar";
import { TextArticleForm } from "../components/TextArticleForm";
import { VideoForm } from "../components/VideoForm";
import { PdfDocumentForm } from "../components/PdfDocumentForm";
import { createChannelPost } from "../api/channelContentApi";
import type { CreateChannelPostInput } from "../types/channelContent.types";
import { useToast } from "@/shared/components/Toast";
import { useMentorLogout } from "@/shared/hooks/useMentorLogout";

function parseTags(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export const CreateChannelContentPage: FC = () => {
  const navigate = useNavigate();
  const { channelId } = useParams<{ channelId: string }>();
  const handleLogoutClick = useMentorLogout();
  const { showToast } = useToast();
  const channelDetailsPath = channelId
    ? `/mentor/channel/${encodeURIComponent(channelId)}`
    : "/mentor/channel";
  const handleBackToChannel = () => navigate(channelDetailsPath);

  const [contentType, setContentType] = useState<"TEXT" | "VIDEO" | "DOCUMENT">("TEXT");
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form States
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

  const handlePublish = async () => {
    if (!title.trim()) {
      showToast("Please provide a title for the content", "error");
      return;
    }

    if (!channelId) {
      showToast("Open a channel before publishing content.", "error");
      return;
    }

    let input: CreateChannelPostInput;
    if (contentType === "TEXT") {
      if (!content.trim()) {
        showToast("Please provide article content.", "error");
        return;
      }
      input = {
        type: "TEXT",
        title: title.trim(),
        content: content.trim(),
        tags: parseTags(tags),
        thumbnail: articleThumbnail ?? undefined,
      };
    } else if (contentType === "VIDEO") {
      if (!description.trim() || !videoFile) {
        showToast("Please provide a video description and select a video file.", "error");
        return;
      }
      if (videoFile.size > 2 * 1024 * 1024 * 1024) {
        showToast("The video file must be 2 GB or smaller.", "error");
        return;
      }
      input = {
        type: "VIDEO",
        title: title.trim(),
        description: description.trim(),
        category,
        tags: parseTags(tags),
        file: videoFile,
        thumbnail: videoThumbnail ?? undefined,
      };
    } else {
      if (!description.trim() || !subject.trim() || !documentFile) {
        showToast("Please complete the document details and select a file.", "error");
        return;
      }
      if (documentFile.size > 50 * 1024 * 1024) {
        showToast("The document file must be 50 MB or smaller.", "error");
        return;
      }
      input = {
        type: "DOCUMENT",
        title: title.trim(),
        description: description.trim(),
        subject: subject.trim(),
        tags: parseTags(tags),
        file: documentFile,
      };
    }

    setSaving(true);
    setUploadProgress(0);
    try {
      await createChannelPost(channelId, input, setUploadProgress);
      showToast("Channel content published successfully!", "success", "Published");
      navigate(channelDetailsPath);
    } catch (error: unknown) {
      showToast(
        error instanceof Error ? error.message : "Failed to publish content",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#FAF8F5] flex flex-col font-sans text-stone-900">
      {/* Top Bar */}
      <ProfileTopBar
        role="MENTOR"
        pageTitle="Channels / Backend Engineering Insider / Create Channel Content"
        onLogout={handleLogoutClick}
        action={handleBackToChannel}
        actionName="Back to Channel"
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <MentorSidebar activeItem="Channel" />

        {/* Main Content Area */}
        <main className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto p-6 sm:p-10 max-w-5xl mx-auto space-y-6 w-full">
          {/* Header Subtitle Banner */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#3D6946]">
              <span className="bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">CHANNEL CREATOR STUDIO</span>
              <span className="text-stone-400">•</span>
              <span className="text-stone-600">Backend Engineering Insider</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
              Create Channel Content
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Share knowledge, resources, videos, and updates with your learners.
            </p>
          </div>

          {/* Type Selector Cards */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
              What do you want to share?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Text / Article */}
              <button
                type="button"
                onClick={() => setContentType("TEXT")}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  contentType === "TEXT"
                    ? "border-[#3D6946] bg-white ring-1 ring-[#3D6946] shadow-xs"
                    : "border-stone-200 bg-white hover:border-stone-300"
                }`}
              >
                {contentType === "TEXT" && (
                  <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#3D6946]" />
                )}
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#3D6946] flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Text / Article</h4>
                    <p className="text-xs text-stone-500 mt-1">
                      Tutorials, mental models, code explanations &amp; deep dives.
                    </p>
                  </div>
                </div>
              </button>

              {/* Card 2: Video */}
              <button
                type="button"
                onClick={() => setContentType("VIDEO")}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  contentType === "VIDEO"
                    ? "border-[#3D6946] bg-white ring-1 ring-[#3D6946] shadow-xs"
                    : "border-stone-200 bg-white hover:border-stone-300"
                }`}
              >
                {contentType === "VIDEO" && (
                  <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#3D6946]" />
                )}
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Video</h4>
                    <p className="text-xs text-stone-500 mt-1">
                      Upload educational video walkthroughs &amp; coding screencasts.
                    </p>
                  </div>
                </div>
              </button>

              {/* Card 3: PDF / Document */}
              <button
                type="button"
                onClick={() => setContentType("DOCUMENT")}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  contentType === "DOCUMENT"
                    ? "border-[#3D6946] bg-white ring-1 ring-[#3D6946] shadow-xs"
                    : "border-stone-200 bg-white hover:border-stone-300"
                }`}
              >
                {contentType === "DOCUMENT" && (
                  <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#3D6946]" />
                )}
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">PDF / Document</h4>
                    <p className="text-xs text-stone-500 mt-1">
                      Syllabus PDFs, cheat sheets &amp; AI Knowledge Base material.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Conditional Form Rendering */}
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
            />
          )}

          {/* Bottom Action Footer */}
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
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#3D6946] hover:bg-[#32573a] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>
                {saving
                  ? uploadProgress > 0
                    ? `Uploading ${uploadProgress}%...`
                    : "Publishing..."
                  : "Publish Content"}
              </span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};