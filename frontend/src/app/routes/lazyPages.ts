import { lazy } from "react";

// Auth module pages
export const LoginPage = lazy(() =>
  import("@/features/auth/pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);

export const RegisterPage = lazy(() =>
  import("@/features/auth/pages/RegisterPage").then((m) => ({ default: m.RegisterPage })),
);

export const VerifyOtpPage = lazy(() =>
  import("@/features/auth/pages/VerifyOtpPage").then((m) => ({ default: m.VerifyOtpPage })),
);

export const ForgotPasswordPage = lazy(() =>
  import("@/features/auth/pages/ForgotPasswordPage").then((m) => ({
    default: m.ForgotPasswordPage,
  })),
);

export const AdminLoginPage = lazy(() =>
  import("@/features/auth/pages/AdminLoginPage").then((m) => ({ default: m.AdminLoginPage })),
);

export const AdminUsersPage = lazy(() =>
  import("@/features/admin/pages/AdminUsersPage").then((m) => ({
    default: m.AdminUsersPage,
  })),
);

export const AdminMentorsPage = lazy(() =>
  import("@/features/admin/pages/AdminMentorsPage").then((m) => ({
    default: m.AdminMentorsPage,
  })),
);

export const AdminMentorDetailsPage = lazy(() =>
  import("@/features/admin/pages/AdminMentorDetailsPage").then((m) => ({
    default: m.AdminMentorDetailsPage,
  })),
);

export const AuditLogsPage = lazy(() =>
  import("@/features/audit-logs/pages/AuditLogsPage").then((m) => ({
    default: m.AuditLogsPage,
  })),
);

// Profile module pages
export const StudentProfilePage = lazy(() =>
  import("@/features/profile/pages/StudentProfilePage").then((m) => ({
    default: m.StudentProfilePage,
  })),
);

export const StudentChannelsPage = lazy(() =>
  import("@/features/channel/pages/studentChannelsPage").then((m) => ({
    default: m.StudentChannelsPage,
  })),
);

export const MentorProfilePage = lazy(() =>
  import("@/features/profile/pages/MentorProfilePage").then((m) => ({
    default: m.MentorProfilePage,
  })),
);

export const MentorSkillsPage = lazy(() =>
  import("@/features/skillsAndExperiences/pages/MentorSkillsPage").then((m) => ({
    default: m.MentorSkillsPage,
  })),
);

export const MentorExperiencePage = lazy(() =>
  import("@/features/skillsAndExperiences/pages/experiencesPage").then((m) => ({
    default: m.MentorExperiencePage,
  })),
);

export const AvailabilityPage = lazy(() =>
  import("@/features/mentor/pages/avilabilityPage").then((m) => ({
    default: m.AvailabilityPage,
  })),
);

export const ChannelsPage = lazy(() =>
  import("@/features/channel/pages/listAllChannelsPage").then((m) => ({ default: m.ChannelsPage })),
);

export const ChannelDetailPage = lazy(() =>
  import("@/features/channel/pages/ChannelDetailPage").then((m) => ({
    default: m.ChannelDetailPage,
  })),
);

export const CreateChannelContentPage = lazy(() =>
  import("@/features/channel/pages/createChannelContent").then((m) => ({
    default: m.CreateChannelContentPage,
  })),
);

// Standalone pages
export const NotFoundPage = lazy(() => import("@/shared/pages/NotFound"));
export const UnauthorizedPage = lazy(() => import("@/shared/pages/UnauthorizedPage"));
export const ForbiddenPage = lazy(() => import("@/shared/pages/ForbiddenPage"));
export const HomePage = lazy(() => import("@/shared/pages/HomePage"));
