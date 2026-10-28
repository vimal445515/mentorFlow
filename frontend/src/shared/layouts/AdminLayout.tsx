import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";

export const AdminLayout: FC = () => {
  return (
    <div className="flex min-h-screen bg-[#0B0C0E] text-white">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
