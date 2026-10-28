import type { FC } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Crown,
  FileText,
  Layers,
  LayoutDashboard,
  ScrollText,
  Presentation,
  ShieldCheck,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "Users", label: "Users", icon: Users, path: "/admin/users" },
  { id: "Mentors", label: "Mentors", icon: Presentation, path: "/admin/mentors" },
  { id: "Bookings", label: "Bookings", icon: CalendarDays },
  { id: "Payments", label: "Payments", icon: CreditCard },
  { id: "Learning Materials", label: "Learning Materials", icon: BookOpen },
  { id: "Subscriptions", label: "Subscriptions", icon: Crown },
  { id: "Permissions", label: "Permissions", icon: ShieldCheck },
  { id: "Reports", label: "Reports", icon: FileText },
  { id: "Audit Logs", label: "Audit Logs", icon: ScrollText, path: "/admin/audit-logs" },
];

export const AdminSidebar: FC = () => (
  <aside className="flex min-h-screen w-64 shrink-0 flex-col justify-between border-r border-[#262626] bg-[#121212] px-4 py-6 text-stone-100">
    <div>
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DC2626] text-white shadow-md">
          <Layers size={20} />
        </div>
        <div className="flex items-center text-lg font-bold tracking-tight">
          <span className="text-white">Mentor</span>
          <span className="text-[#DC2626]">Admin</span>
        </div>
      </div>

      <nav aria-label="Admin navigation" className="space-y-1.5 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return item.path ? (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex w-full items-center gap-3.5 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#DC2626] font-semibold text-white shadow-lg shadow-red-600/20"
                    : "text-stone-400 hover:bg-stone-900 hover:text-white"
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ) : (
            <button
              key={item.id}
              type="button"
              disabled
              title="This page is not available yet"
              className="flex w-full cursor-not-allowed items-center gap-3.5 rounded-2xl px-4 py-3 text-left text-sm font-medium text-stone-500"
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>

    <div className="mt-4 border-t border-[#262626] px-2 pt-4">
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-semibold text-stone-200">Platform Admin</p>
        <p className="truncate text-[11px] text-stone-400">admin@mentorflow.edu</p>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-emerald-500">
          <CheckCircle2 size={13} />
          <span>System Operational</span>
        </div>
      </div>
    </div>
  </aside>
);
