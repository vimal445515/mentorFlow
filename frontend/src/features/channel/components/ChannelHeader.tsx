import type { FC } from "react";
import { ShieldCheck, Plus } from "lucide-react";
import type { Channel } from "../types/channel.types";

interface ChannelHeaderProps {
  channel: Channel;
  mentorName: string;
  mentorHeadline?: string;
  mentorProfileImageUrl?: string;
  isMentorVerified: boolean;
  yearsExperience?: number;
  publishedItems: number;
  onOpenCreateModal?: () => void;
}

export const ChannelHeader: FC<ChannelHeaderProps> = ({
  channel,
  mentorName,
  mentorHeadline,
  mentorProfileImageUrl,
  isMentorVerified,
  yearsExperience,
  publishedItems,
  onOpenCreateModal,
}) => {
  const mentorInitials = mentorName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="relative rounded-2xl bg-gradient-to-r from-[#2A4D32] via-[#3D6946] to-[#4E7D56] text-white p-6 sm:p-8 shadow-md overflow-hidden">
      {/* Decorative watermark / background element */}
      <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Top badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>CHANNELS MANAGEMENT STUDIO</span>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{channel.name}</h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            {channel.description}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-emerald-100">
            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">
              {channel.category}
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">
              {channel.topic}
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1">
              {channel.status}
            </span>
            {channel.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Host Info & Quick Stats Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-4 border-t border-white/15">
          {/* Host Card */}
          <div className="flex items-center gap-3">
            {mentorProfileImageUrl ? (
              <img
                src={mentorProfileImageUrl}
                alt={mentorName}
                className="w-12 h-12 rounded-full object-cover border-2 border-white/30 shadow-sm"
              />
            ) : (
              <div
                aria-label={mentorName}
                className="w-12 h-12 rounded-full border-2 border-white/30 bg-white/15 shadow-sm flex items-center justify-center text-sm font-bold"
              >
                {mentorInitials || "M"}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold">Channel Host: {mentorName}</span>
                {isMentorVerified && (
                  <span className="inline-flex items-center gap-1 bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    <ShieldCheck className="w-3 h-3" /> Verified Mentor
                  </span>
                )}
              </div>
              <p className="text-[11px] text-emerald-200">
                {mentorHeadline || "Mentor"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* <button
              type="button"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Channel</span>
            </button> */}
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-white text-stone-900 hover:bg-emerald-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-[#3D6946]" />
              <span>Create Content</span>
            </button>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
          {yearsExperience !== undefined && (
            <>
              <div>
                <span className="text-xl font-black">{yearsExperience}</span>
                <span className="text-emerald-200 ml-1.5">Years Experience</span>
              </div>
              <div className="w-[1px] h-4 bg-white/20" />
            </>
          )}
          <div>
            <span className="text-xl font-black">{publishedItems}</span>
            <span className="text-emerald-200 ml-1.5">Published Items</span>
          </div>
        </div>
      </div>
    </div>
  );
};
