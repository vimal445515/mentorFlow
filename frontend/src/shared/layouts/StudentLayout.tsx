import type { FC } from "react";
import { Outlet } from "react-router-dom";

export const StudentLayout: FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
