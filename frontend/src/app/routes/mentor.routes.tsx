import type { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/shared/guards/ProtectedRoute";
import { RoleGuard } from "@/shared/guards/RoleGuard";
import { MentorLayout } from "@/shared/layouts/MentorLayout";
import { withSuspense } from "@/shared/components/withSuspense";
import {
  AvailabilityPage,
  ChannelDetailPage,
  ChannelsPage,
  CreateChannelContentPage,
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
      path: "skills",
      element: withSuspense(<MentorSkillsPage />),
    },
    {
      path: "experiences",
      element: withSuspense(<MentorExperiencePage />),
    },
    {
      path: "availability",
      element: withSuspense(<AvailabilityPage />),
    },
    {
      path: "channel",
      element: withSuspense(<ChannelsPage />),
    },
    {
      path: "channel/create-content",
      element: withSuspense(<CreateChannelContentPage />),
    },
    {
      path: "channel/:channelId",
      element: withSuspense(<ChannelDetailPage />),
    },
    {
      path: "channel/:channelId/create-content",
      element: withSuspense(<CreateChannelContentPage />),
    },
    {
      path: "channel/:channelId/posts/:postId/edit",
      element: withSuspense(<CreateChannelContentPage />),
    },
  ],
};
