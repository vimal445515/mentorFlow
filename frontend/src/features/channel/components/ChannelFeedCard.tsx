import type { FC, ReactNode } from "react";
import {
  ShieldCheck,
  Heart,
  MessageSquare,
  Share2,
  Edit,
  Eye,
  Download,
} from "lucide-react";

interface ChannelFeedCardProps {
  authorName: string;
  authorRole: string;
  timestamp: string;
  badgeLabel: string;
  badgeColor?: "emerald" | "orange" | "purple" | "amber";
  title: string;
  description?: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  viewsCount?: number;
  downloadsCount?: number;
  children?: ReactNode; // For embedded media (Video, code preview, PDF attachment)
}

export const ChannelFeedCard: FC<ChannelFeedCardProps> = ({
  authorName,
  authorRole,
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
}) => {
  const badgeStyles = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <article className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
      {/* Author & Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
            alt={authorName}
            className="w-10 h-10 rounded-full object-cover border border-stone-200"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-stone-900">{authorName}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-[#3D6946]" />
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

      {/* Embedded Custom Content (Video player, Image, PDF attachment card, Code snippet) */}
      {children}

      {/* Tags */}
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

      {/* Card Footer Actions & Stats */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-100 text-xs text-stone-500">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-1 hover:text-red-600 transition-colors cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5" />
            <span>{likesCount}</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1 hover:text-[#3D6946] transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{commentsCount} Comments</span>
          </button>
          {viewsCount && (
            <span className="flex items-center gap-1 text-stone-400">
              <Eye className="w-3.5 h-3.5" /> {viewsCount} Views
            </span>
          )}
          {downloadsCount && (
            <span className="flex items-center gap-1 text-stone-400">
              <Download className="w-3.5 h-3.5" /> {downloadsCount} Downloads
            </span>
          )}
        </div>

        {/* Secondary Management Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Share2 className="w-3 h-3" />
            <span>Share</span>
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Edit className="w-3 h-3" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-red-50 text-red-600 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Unpublish</span>
          </button>
        </div>
      </div>
    </article>
  );
};
