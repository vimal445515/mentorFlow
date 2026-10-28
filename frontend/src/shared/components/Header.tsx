import type { FC } from "react";
import brandIcon from "@/assets/brand-icon.svg";

interface HeaderProps {
  rightText?: string;
  rightLinkText?: string;
  onRightLinkClick?: () => void;
  onLogoClick?: () => void;
  isDark?: boolean;
}

export const Header: FC<HeaderProps> = ({
  rightText,
  rightLinkText,
  onRightLinkClick,
  onLogoClick,
  isDark = false,
}) => {
  return (
    <header
      className={`w-full px-6 sm:px-12 py-5 flex items-center justify-between border-b transition-colors sticky top-0 z-20 ${
        isDark
          ? "border-neutral-800 bg-[#0B0C0E]/90 backdrop-blur-sm text-white"
          : "border-stone-200/60 bg-[#FAF8F5]/80 backdrop-blur-sm text-stone-900"
      }`}
    >
      <div
        onClick={onLogoClick}
        className="inline-flex items-center gap-2.5 cursor-pointer select-none group"
      >
        <div className="brand-icon">
          <img src={brandIcon} alt="MentorFlow Icon" width="22" height="22" />
        </div>

        <span
          className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-stone-800"}`}
        >
          Mentor
          <span className={isDark ? "text-neutral-300" : "text-stone-900"}>Flow</span>
        </span>
      </div>

      {rightLinkText && (
        <div
          className={`text-xs sm:text-sm flex items-center gap-1.5 font-medium ${
            isDark ? "text-neutral-400" : "text-stone-600"
          }`}
        >
          {rightText && (
            <span className={`hidden xs:inline ${isDark ? "text-neutral-500" : "text-stone-500"}`}>
              {rightText}
            </span>
          )}
          <button
            type="button"
            onClick={onRightLinkClick}
            className={`font-semibold transition-colors inline-flex items-center gap-1 focus:outline-none focus:underline ${
              isDark ? "text-neutral-200 hover:text-white" : "text-stone-900 hover:text-stone-950"
            }`}
          >
            <span>{rightLinkText}</span>
          </button>
        </div>
      )}
    </header>
  );
};
