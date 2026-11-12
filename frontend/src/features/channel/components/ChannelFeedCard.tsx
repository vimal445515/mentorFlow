import type { FC, ReactNode } from "react";
import {
  ShieldCheck,
  Heart,
  MessageSquare,
  Share2,
  Edit,
  Eye,
  Download,
  Bookmark,
  Calendar,
  Sparkles,
} from "lucide-react";
import type { UserRole } from "./ChannelHeader";

interface ChannelFeedCardProps {
  role?: UserRole;
  authorName: string;
  authorRole: string;
  authorImageUrl?: string;
  isAuthorVerified?: boolean;
  timestamp: string;
  badgeLabel: string;
  badgeColor?: "emerald" | "orange" | "purple" | "amber" | "blue";
  title: string;
  description?: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  viewsCount?: number;
  downloadsCount?: number;
  children?: ReactNode;
  // Mentor props
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  // Student props
  helpTopic?: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  onToggleLike?: () => void;
  onToggleBookmark?: () => void;
  onBookSession?: () => void;
  onShare?: () => void;
}

export const ChannelFeedCard: FC<ChannelFeedCardProps> = ({
  role = "MENTOR",
  authorName,
  authorRole,
  authorImageUrl,
  isAuthorVerified = false,
  timestamp,
  badgeLabel,
  badgeColor = "emerald",
  title,
  description,
  tags,
  likesCount,
  commentsCount,
  viewsCount,
  downloadsCount,
  children,
  onEdit,
  onDelete,
  isDeleting = false,
  helpTopic,
  isLiked = false,
  isBookmarked = false,
  onToggleLike,
  onToggleBookmark,
  onBookSession,
  onShare,
}) => {
  const isStudent = role === "STUDENT";

  const badgeStyles = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    orange: "bg-rose-50 text-rose-700 border-rose-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-sky-50 text-sky-700 border-sky-200",
  };

  return (
    <article className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
      {/* Author & Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {authorImageUrl ? (
            <img
              src={authorImageUrl}
              alt={authorName}
              className="w-10 h-10 rounded-full object-cover border border-stone-200"
            />
          ) : (
            <div
              aria-label={authorName}
              className="w-10 h-10 rounded-full border border-stone-200 bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-600"
            >
              {authorName.trim().charAt(0).toUpperCase() || "M"}
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-stone-900">{authorName}</span>
              {isAuthorVerified && (
                <ShieldCheck
                  className={`w-3.5 h-3.5 ${isStudent ? "text-emerald-600" : "text-[#3D6946]"}`}
                />
              )}
            </div>
            <p className="text-[10px] text-stone-500">
              {timestamp} • {authorRole}
            </p>
          </div>
        </div>

        <span
          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border uppercase tracking-wider ${badgeStyles[badgeColor]}`}
        >
          {badgeLabel}
        </span>
      </div>

      {/* Title & Description */}
      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-stone-900 tracking-tight">{title}</h3>
        {description && <p className="text-xs text-stone-600 leading-relaxed">{description}</p>}
      </div>

      {/* Embedded Custom Content */}
      {children}

      {/* Tags (Shown in Mentor mode or if needed) */}
      {!isStudent && tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-stone-200 bg-stone-50 text-stone-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Student Contextual Upsell Strip */}
      {isStudent && (
        <div className="rounded-xl bg-[#FDF8F3] border border-[#F2E6D8] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-stone-700">
            <Sparkles className="w-3.5 h-3.5 text-[#B44D29] shrink-0" />
            <span>
              Need personalized help with{" "}
              <strong className="font-semibold text-[#B44D29]">
                {helpTopic || tags[0] || "this topic"}
              </strong>
              ?
            </span>
          </div>
          <button
            type="button"
            onClick={onBookSession}
            className="px-3 py-1.5 rounded-lg bg-[#3D6946] hover:bg-[#2F5337] text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Calendar className="w-3 h-3" />
            <span>Book a Session</span>
          </button>
        </div>
      )}

      {/* Card Footer Actions & Stats */}
      <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-100 text-xs text-stone-500">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onToggleLike}
            className={`flex items-center gap-1 transition-colors cursor-pointer ${
              isLiked ? "text-red-600 font-semibold" : "hover:text-red-600"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-red-600 text-red-600" : ""}`} />
            <span>{likesCount}</span>
          </button>
          <button
            type="button"
            className={`flex items-center gap-1 transition-colors cursor-pointer ${
              isStudent ? "hover:text-[#B44D29]" : "hover:text-[#3D6946]"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{commentsCount} Comments</span>
          </button>
          {!isStudent && viewsCount !== undefined && (
            <span className="flex items-center gap-1 text-stone-400">
              <Eye className="w-3.5 h-3.5" /> {viewsCount} Views
            </span>
          )}
          {!isStudent && downloadsCount !== undefined && (
            <span className="flex items-center gap-1 text-stone-400">
              <Download className="w-3.5 h-3.5" /> {downloadsCount} Downloads
            </span>
          )}
        </div>

        {/* Role-Specific Right Actions */}
        <div className="flex items-center gap-2">
          {isStudent ? (
            <div className="inline-flex rounded-xl border border-stone-200 overflow-hidden bg-white">
              <button
                type="button"
                onClick={onToggleBookmark}
                aria-label="Bookmark post"
                className="px-2.5 py-1.5 hover:bg-stone-50 text-stone-700 border-r border-stone-200 transition-colors cursor-pointer"
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${
                    isBookmarked ? "fill-[#B44D29] text-[#B44D29]" : "text-stone-600"
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={onShare}
                className="px-3 py-1.5 hover:bg-stone-50 text-stone-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3 h-3" />
                <span>Share</span>
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={onShare}
                className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Share2 className="w-3 h-3" />
                <span>Share</span>
              </button>
              <button
                type="button"
                onClick={onEdit}
                className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Edit className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={onDelete}
                disabled={isDeleting}
                className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-red-50 text-red-600 font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
              >
                <span>{isDeleting ? "Deleting..." : "Delete"}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
};
