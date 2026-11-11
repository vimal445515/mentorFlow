import type { FC } from "react";
import {
  LayoutDashboard,
  User,
  Code2,
  Briefcase,
  Clock,
  Megaphone,
  Calendar,
  Video,
  ClipboardList,
  CreditCard,
  Banknote,
  Bot,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/store/hooks";

interface MentorSidebarProps {
  activeItem?: string;
}

export const MentorSidebar: FC<MentorSidebarProps> = ({ activeItem = "Profile" }) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const userName = user?.fullName || "John Doe";
  const avatarUrl = user?.profileImageUrl;

  const navItems = [
    { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "Profile", label: "Profile", icon: User, path: "/mentor/profile" },
    { id: "skills", label: "Skills", icon: Code2, path: "/mentor/skills" },
    { id: "Experiences", label: "Experiences", icon: Briefcase, path: "/mentor/experiences" },
    { id: "Availability", label: "Availability", icon: Clock, path: "/mentor/availability" },
    { id: "Channel", label: "Channel", icon: Megaphone, path: "/mentor/channel" },
    { id: "Bookings", label: "Bookings", icon: Calendar },
    { id: "Sessions", label: "Sessions", icon: Video },
    { id: "Assignment Review", label: "Assignment Review", icon: ClipboardList },
    { id: "Earnings", label: "Earnings", icon: CreditCard },
    { id: "Payout", label: "Payout", icon: Banknote },
    { id: "AI Agents", label: "AI Agents", icon: Bot },
    { id: "Notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <aside className="sticky top-0 flex h-full w-64 shrink-0 flex-col justify-between overflow-hidden border-r border-[#EBE6DF] bg-white px-4 py-6">
      {/* Navigation Links */}
      <nav className="scrollbar-hidden min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              type="button"
              disabled={!item.path}
              onClick={() => item.path && navigate(item.path)}
              title={item.path ? undefined : "This page is not available yet"}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors text-left ${
                isActive
                  ? "bg-[#FDF0EC] text-[#C85A32] font-semibold"
                  : item.path
                    ? "text-stone-600 hover:text-stone-900 hover:bg-[#FAF8F5] cursor-pointer"
                    : "text-stone-400 cursor-not-allowed"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? "text-[#C85A32]" : "text-stone-400 group-hover:text-stone-600"
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile Pill */}
      <div className="pt-4 mt-4 border-t border-[#F0EBE3]">
        <div className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors shadow-xs">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover shrink-0 border border-stone-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-xs shrink-0 bg-[#3D6946]">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="overflow-hidden min-w-0">
            <p className="text-xs font-bold text-stone-900 truncate">{userName}</p>
            <p className="text-[11px] text-stone-500 truncate">Verified Staff Mentor</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
