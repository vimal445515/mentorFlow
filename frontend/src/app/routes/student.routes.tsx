import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/shared/guards/ProtectedRoute";
import { RoleGuard } from "@/shared/guards/RoleGuard";
import { StudentLayout } from "@/shared/layouts/StudentLayout";
import { withSuspense } from "@/shared/components/withSuspense";
import { StudentChannelsPage, StudentProfilePage } from "./lazyPages";

export const studentRoutes: RouteObject = {
  path: "/student",
  element: (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["STUDENT"]}>
        <StudentLayout />
      </RoleGuard>
    </ProtectedRoute>
  ),
  children: [
    {
      path: "channels",
      element: withSuspense(<StudentChannelsPage />),
    },
    {
      path: "profile",
      element: withSuspense(<StudentProfilePage />),
    },
  ],
};
