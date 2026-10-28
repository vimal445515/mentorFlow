import { type RouteObject, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/shared/guards/ProtectedRoute";
import { RoleGuard } from "@/shared/guards/RoleGuard";
import { AdminLayout } from "@/shared/layouts/AdminLayout";
import {
  AdminMentorDetailsPage,
  AdminMentorsPage,
  AdminUsersPage,
  AuditLogsPage,
} from "./lazyPages";
import { withSuspense } from "@/shared/components/withSuspense";

export const adminRoutes: RouteObject = {
  path: "/admin",
  element: (
    <ProtectedRoute redirectTo="/admin-login">
      <RoleGuard allowedRoles={["ADMIN"]}>
        <AdminLayout />
      </RoleGuard>
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <Navigate to="/admin/users" replace />,
    },
    {
      path: "users",
      element: withSuspense(<AdminUsersPage />),
    },
    {
      path: "mentors",
      element: withSuspense(<AdminMentorsPage />),
    },
    {
      path: "mentors/:mentorId",
      element: withSuspense(<AdminMentorDetailsPage />),
    },
    {
      path: "audit-logs",
      element: withSuspense(<AuditLogsPage />),
    },
  ],
};
