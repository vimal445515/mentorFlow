import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/shared/guards/ProtectedRoute";
import { RoleGuard } from "@/shared/guards/RoleGuard";
import { MentorLayout } from "@/shared/layouts/MentorLayout";
import { withSuspense } from "@/shared/components/withSuspense";
import {
  AvailabilityPage,
  MentorExperiencePage,
  MentorProfilePage,
  MentorSkillsPage,
} from "./lazyPages";

export const mentorRoutes: RouteObject = {
  path: "/mentor",
  element: (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["MENTOR"]}>
        <MentorLayout />
      </RoleGuard>
    </ProtectedRoute>
  ),
  children: [
    {
      path: "profile",
      element: withSuspense(<MentorProfilePage />),
    },
    {
      path:"skills",
      element:withSuspense(<MentorSkillsPage/>)
    },
    {
      path:"experiences",
      element:withSuspense(<MentorExperiencePage/>)
    },
    {
      path: "availability",
      element: withSuspense(<AvailabilityPage />),
    }
  ],
};
