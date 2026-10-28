import type { FC, ReactNode } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/shared/components/Toast";
import { handleAdminLogout } from "@/shared/utils/adminLogout";

interface AdminTopBarProps {
  children: ReactNode;
  actions?: ReactNode;
}

export const AdminTopBar: FC<AdminTopBarProps> = ({ children, actions }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  return (
    <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-[#EBE6DF] bg-white px-5 py-3 sm:px-8">
      <div className="text-sm font-medium text-stone-500">{children}</div>
      <div className="flex flex-wrap items-center gap-2">
        {actions}
        <button
          type="button"
          onClick={() => void handleAdminLogout(navigate, showToast)}
          className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-700 shadow-xs transition-colors hover:bg-stone-50"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </header>
  );
};
