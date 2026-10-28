import type { FC } from "react";
import brandIcon from "@/assets/brand-icon.svg";
import { Eye } from "lucide-react";

export interface ProfileTopBarProps {
  role: "STUDENT" | "MENTOR";
  pageTitle: string;
  onLogout: () => void;
  action?: () => void;
  actionName?:string;
}

export const ProfileTopBar: FC<ProfileTopBarProps> = ({
  role,
  pageTitle,
  onLogout,
  action,
  actionName
}) => {
  return (
    <header className="w-full bg-white border-b border-[#EBE6DF] px-6 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20">
      {/* Left side: Logo + Breadcrumb */}
      <div className="flex items-center gap-6 sm:gap-8">
        {/* MentorFlow Brand */}
        <div className="flex items-center gap-2.5 select-none">
          <img src={brandIcon} alt="MentorFlow Icon" width="26" height="26" />
          <span className="text-xl font-bold tracking-tight text-stone-900">
            Mentor<span className="text-stone-800">Flow</span>
          </span>
        </div>

        {/* Vertical divider */}
        <div className="hidden sm:block h-5 w-[1px] bg-stone-200" />

        {/* Breadcrumb Title */}
        <div className="text-sm font-medium flex items-center gap-1.5">
          <span className="text-stone-500">{role === "MENTOR" ? "Mentor" : "Student"}</span>
          <span className="text-stone-300">/</span>
          <span className="text-stone-900 font-bold">{pageTitle}</span>
        </div>
      </div>

      {/* Right side: Action buttons */}
      <div className="flex items-center gap-3">
        {role === "MENTOR" && action && (
          <button
            type="button"
            onClick={action}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-stone-200 text-stone-700 bg-white hover:bg-stone-50 transition-colors cursor-pointer shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-stone-500" />
            <span>{actionName}</span>
          </button>
        )}

        <button
          type="button"
          onClick={onLogout}
          className="px-4 py-1.5 text-xs font-semibold rounded-lg border border-stone-200 text-stone-700 bg-white hover:bg-stone-50 transition-colors cursor-pointer shadow-xs"
        >
          Log out
        </button>
      </div>
    </header>
  );
};
