import type { FC } from "react";
import { ShieldCheck, Plus, Check, Calendar } from "lucide-react";
import type { Channel } from "../types/channel.types";

export type UserRole = "MENTOR" | "STUDENT";

interface ChannelHeaderProps {
  role?: UserRole;
  channel: Channel;
  mentorName: string;
  mentorHeadline?: string;
  mentorProfileImageUrl?: string;
  isMentorVerified: boolean;
  yearsExperience?: number;
  publishedItems: number;
  // Mentor actions
  onOpenCreateModal?: () => void;
  // Student actions
  showFollowAction?: boolean;
  isFollowing?: boolean;
  onToggleFollow?: () => void;
  onBookSession?: () => void;
}

export const ChannelHeader: FC<ChannelHeaderProps> = ({
  role = "MENTOR",
  channel,
  mentorName,
  mentorHeadline,
  mentorProfileImageUrl,
  isMentorVerified,
  yearsExperience,
  publishedItems,
  onOpenCreateModal,
  showFollowAction = true,
  isFollowing = false,
  onToggleFollow,
  onBookSession,
}) => {
  const isStudent = role === "STUDENT";

  const mentorInitials = mentorName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  if (isStudent) {
    return (
      <div className="rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-xs">
        {/* Terracotta Banner */}
        <div className="relative bg-gradient-to-r from-[#8E3A1D] via-[#B44D29] to-[#D47A5B] text-white px-6 sm:px-8 pt-6 pb-12 overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
          <div className="relative z-10 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{channel.name}</h1>
          </div>
        </div>

        {/* White Info Card Body overlapping banner */}
        <div className="px-6 sm:px-8 pb-6 -mt-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="flex items-end gap-4 p-4">
              {mentorProfileImageUrl ? (
                <img
                  src={mentorProfileImageUrl}
                  alt={mentorName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm "
                />
              ) : (
                <div className="w-16 h-16 rounded-full border-2 border-white bg-[#FBEBE4] text-[#B44D29] shadow-sm flex items-center justify-center text-lg font-bold">
                  {mentorInitials || "M"}
                </div>
              )}

              <div className="pb-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-bold text-stone-900">{mentorName}</span>
                  {isMentorVerified && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" /> Verified Staff Mentor
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 mt-0.5">{mentorHeadline || "Mentor"}</p>
              </div>
            </div>

            {/* Student CTAs */}
            <div className="flex flex-wrap items-center gap-2.5">
              {showFollowAction && (
                <button
                  type="button"
                  onClick={onToggleFollow}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                    isFollowing
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-white text-stone-800 border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Following Channel</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Follow Channel</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={onBookSession}
                className="px-4 py-2 rounded-xl bg-[#B44D29] hover:bg-[#9E4121] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book a Session</span>
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 max-w-3xl leading-relaxed mt-4">
            {channel.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-medium text-stone-700">
              {channel.category}
            </span>
            <span className="rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-medium text-stone-700">
              {channel.topic}
            </span>
            {channel.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-medium text-stone-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- MENTOR VIEW (Original Studio Design) ---
  return (
    <div className="relative rounded-2xl bg-gradient-to-r from-[#2A4D32] via-[#3D6946] to-[#4E7D56] text-white p-6 sm:p-8 shadow-md overflow-hidden">
      <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>CHANNELS MANAGEMENT STUDIO</span>
        </div>

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

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-4 border-t border-white/15">
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
              <p className="text-[11px] text-emerald-200">{mentorHeadline || "Mentor"}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
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
