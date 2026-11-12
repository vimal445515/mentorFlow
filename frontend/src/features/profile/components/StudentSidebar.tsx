import type { FC } from "react";
import {
  LayoutDashboard,
  Compass,
  Users,
  Video,
  Megaphone,
  Heart,
  Award,
  Crown,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/store/hooks";

interface StudentSidebarProps {
  activeItem?: string;
  onSelectItem?: (item: string) => void;
}

export const StudentSidebar: FC<StudentSidebarProps> = ({
  activeItem = "My Profile",
  onSelectItem,
}) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const userName = user?.fullName || "Alex Morgan";
  const avatarUrl = user?.profileImageUrl;

  const navItems = [
    { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "Roadmaps", label: "Roadmaps", icon: Compass },
    { id: "Find Mentor", label: "Find Mentor", icon: Users },
    { id: "My Sessions", label: "My Sessions", icon: Video },
    { id: "Channels", label: "Channels", icon: Megaphone, path: "/student/channels" },
    { id: "Following", label: "Following", icon: Heart },
    { id: "Badges & Progress", label: "Badges & Progress", icon: Award },
    { id: "Subscriptions", label: "Subscriptions", icon: Crown },
    { id: "Notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-[#EBE6DF] min-h-[calc(100vh-65px)] flex flex-col justify-between py-6 px-4">
      {/* Navigation Links */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              type="button"
              disabled={!item.path}
              onClick={() => {
                onSelectItem?.(item.id);
                if (item.path) navigate(item.path);
              }}
              title={item.path ? undefined : "This page is not available yet"}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
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
      <div className="pt-4 mt-6 border-t border-[#F0EBE3]">
        <div className="flex items-center gap-3 p-2.5 rounded-xl border border-[#FADCD0] bg-[#FFF8F5]/80 transition-all shadow-xs">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover shrink-0 border border-stone-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-xs shrink-0 bg-[#C85A32]">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="overflow-hidden min-w-0">
            <p className="text-xs font-bold text-stone-900 truncate">{userName}</p>
            <p className="text-[11px] text-stone-500 truncate">Student • Premium</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
