import type { FC } from "react";
import { ShieldCheck, Plus, Edit3 } from "lucide-react";

interface ChannelHeaderProps {
  onOpenCreateModal?: () => void;
}

export const ChannelHeader: FC<ChannelHeaderProps> = ({ onOpenCreateModal }) => {
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
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Backend Engineering Insider
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            Deep dive architectural patterns, advanced PostgreSQL scaling, Redis caching strategies
            &amp; community knowledge base. Expert system design walk-throughs &amp;
            production-grade blueprints for modern software engineers.
          </p>
        </div>

        {/* Host Info & Quick Stats Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-4 border-t border-white/15">
          {/* Host Card */}
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
              alt="John Doe"
              className="w-12 h-12 rounded-full object-cover border-2 border-white/30 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold">Channel Host: John Doe</span>
                <span className="inline-flex items-center gap-1 bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  <ShieldCheck className="w-3 h-3" /> Verified Staff
                </span>
              </div>
              <p className="text-[11px] text-emerald-200">
                Staff Backend Architect &amp; Principal Mentor
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Channel</span>
            </button>
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
          <div>
            <span className="text-xl font-black">1,420</span>
            <span className="text-emerald-200 ml-1.5">Subscriber Learners</span>
          </div>
          <div className="w-[1px] h-4 bg-white/20" />
          <div>
            <span className="text-xl font-black">24</span>
            <span className="text-emerald-200 ml-1.5">Published Items</span>
          </div>
        </div>
      </div>
    </div>
  );
};
