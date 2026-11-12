import type { FC } from "react";
import {
  Users,
  FileText,
  BarChart3,
  Clock,
  Calendar,
  Star,
  CheckCircle2,
  Download,
  ExternalLink,
} from "lucide-react";
import type { UserRole } from "./ChannelHeader";

export interface LearningPackItem {
  id: string;
  title: string;
  subtitle: string;
  fileUrl?: string;
}

interface ChannelStatsSidebarProps {
  role?: UserRole;
  // Student props
  mentorName?: string;
  mentorBio?: string;
  hourlyRate?: string;
  nextAvailability?: string;
  rating?: string;
  reviewsCount?: number;
  sessionsCompleted?: string;
  followersCount?: string;
  learningPacks?: LearningPackItem[];
  onBookSession?: () => void;
  onViewMentorProfile?: () => void;
}

export const ChannelStatsSidebar: FC<ChannelStatsSidebarProps> = ({
  role = "MENTOR",
  mentorName = "John",
  mentorBio = "Verified Staff Backend Architect with 10+ years designing high-throughput distributed systems.",
  hourlyRate = "₹500/hr",
  nextAvailability = "Wednesday, 20 Oct • 6:00 PM IST",
  rating = "4.95",
  reviewsCount = 142,
  sessionsCompleted = "340+ Sessions Completed",
  followersCount = "1,420 Channel Followers",
  learningPacks = [],
  onBookSession,
  onViewMentorProfile,
}) => {
  if (role === "STUDENT") {
    return (<></>
      // <aside className="w-full xl:w-60 space-y-5 shrink-0">
      //   {/* 1. 1-on-1 Private Mentoring Card */}
      //   <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
      //     <div className="flex items-center justify-between">
      //       <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
      //         Real-time Slots Open
      //       </span>
      //       <span className="text-sm font-extrabold text-stone-900">{hourlyRate}</span>
      //     </div>

      //     <div className="space-y-1">
      //       <h4 className="text-sm font-bold text-stone-900">1-on-1 Private Mentoring</h4>
      //       <p className="text-xs text-stone-500 leading-relaxed">
      //         Stuck on a problem from this channel? Book a private mentorship session for
      //         personalized code audits and architecture guidance.
      //       </p>
      //     </div>

      //     <div className="rounded-xl bg-[#FAF8F5] border border-stone-200/80 p-3 flex items-start gap-2.5">
      //       <Clock className="w-4 h-4 text-[#B44D29] shrink-0 mt-0.5" />
      //       <div>
      //         <p className="text-[10px] text-stone-500">Next Availability:</p>
      //         <p className="text-xs font-bold text-stone-800">{nextAvailability}</p>
      //       </div>
      //     </div>

      //     <button
      //       type="button"
      //       onClick={onBookSession}
      //       className="w-full py-2.5 px-4 rounded-xl bg-[#B44D29] hover:bg-[#9E4121] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
      //     >
      //       <Calendar className="w-3.5 h-3.5" />
      //       <span>Book a Session with {mentorName.split(" ")[0]}</span>
      //     </button>
      //   </div>

      //   {/* 2. About this Mentor Card */}
      //   <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
      //     <h4 className="text-xs font-bold text-stone-900">About this Mentor</h4>
      //     <p className="text-xs text-stone-600 leading-relaxed">{mentorBio}</p>

      //     <div className="space-y-2.5 text-xs text-stone-700 pt-1">
      //       <div className="flex items-center gap-2">
      //         <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      //         <span>
      //           <strong className="font-bold text-stone-900">{rating} Rating</strong> (
      //           {reviewsCount} reviews)
      //         </span>
      //       </div>
      //       <div className="flex items-center gap-2">
      //         <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
      //         <span>{sessionsCompleted}</span>
      //       </div>
      //       <div className="flex items-center gap-2">
      //         <Users className="w-3.5 h-3.5 text-[#B44D29]" />
      //         <span>{followersCount}</span>
      //       </div>
      //     </div>

      //     <button
      //       type="button"
      //       onClick={onViewMentorProfile}
      //       className="w-full py-2 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      //     >
      //       <span>View Full Profile & Experience</span>
      //       <ExternalLink className="w-3 h-3 text-stone-500" />
      //     </button>
      //   </div>

      //   {/* 3. Channel Learning Packs Card */}
      //   {learningPacks.length > 0 && (
      //     <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
      //       <h4 className="text-xs font-bold text-stone-900">Channel Learning Packs</h4>
      //       <div className="space-y-2.5">
      //         {learningPacks.map((pack) => (
      //           <a
      //             key={pack.id}
      //             href={pack.fileUrl || "#"}
      //             target="_blank"
      //             rel="noreferrer"
      //             className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-stone-100 bg-[#FAF8F5] hover:border-stone-300 transition-colors"
      //           >
      //             <div className="flex items-center gap-2.5 min-w-0">
      //               <div className="w-8 h-8 rounded-lg bg-[#FBEBE4] text-[#B44D29] flex items-center justify-center shrink-0">
      //                 <FileText className="w-4 h-4" />
      //               </div>
      //               <div className="min-w-0">
      //                 <p className="text-xs font-bold text-stone-900 truncate">{pack.title}</p>
      //                 <p className="text-[10px] text-stone-500 truncate">{pack.subtitle}</p>
      //               </div>
      //             </div>
      //             <Download className="w-3.5 h-3.5 text-stone-400 shrink-0" />
      //           </a>
      //         ))}
      //       </div>
      //     </div>
      //   )}
      // </aside>
    );
  }

  // --- MENTOR VIEW (Original 30-Day Channel Reach) ---
  return (
    <aside className="w-full lg:w-72 space-y-5 shrink-0">
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            30-Day Channel Reach
          </h4>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Active
          </span>
        </div>

        <div className="space-y-3 divide-y divide-stone-100">
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-stone-500 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-stone-400" /> Views
            </span>
            <span className="text-xs font-bold text-stone-900">0</span>
          </div>
          <div className="flex items-center justify-between pt-3">
            <span className="text-xs text-stone-500 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-stone-400" /> Downloads
            </span>
            <span className="text-xs font-bold text-stone-900">0</span>
          </div>
          <div className="flex items-center justify-between pt-3">
            <span className="text-xs text-stone-500 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-stone-400" /> Student Subscriptions
            </span>
            <span className="text-xs font-bold text-stone-900">0</span>
          </div>
          <div className="flex items-center justify-between pt-3">
            <span className="text-xs text-stone-500 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-stone-400" /> Revenue Earnings
            </span>
            <span className="text-xs font-extrabold text-emerald-700">₹0</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
