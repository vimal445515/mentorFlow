import type { FC } from "react";
import { Users, FileText, BarChart3, HelpCircle, Plus } from "lucide-react";

export const ChannelStatsSidebar: FC = () => {
  return (
    <aside className="w-full lg:w-72 space-y-5 shrink-0">
      {/* 30-Day Channel Reach Widget */}
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
