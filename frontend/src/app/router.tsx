import { createBrowserRouter } from "react-router-dom";
import { publicRoutes } from "./routes/public.routes";
import { studentRoutes } from "./routes/student.routes";
import { mentorRoutes } from "./routes/mentor.routes";
import { adminRoutes } from "./routes/admin.routes";
import { ForbiddenPage, HomePage, NotFoundPage, UnauthorizedPage } from "./routes/lazyPages";
import { withSuspense } from "@/shared/components/withSuspense";

export const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(<HomePage />),
  },
  {
    path: "/profile",
    element: withSuspense(<HomePage />),
  },

  publicRoutes,
  studentRoutes,
  mentorRoutes,
  adminRoutes,

  {
    path: "/unauthorized",
    element: withSuspense(<UnauthorizedPage />),
  },
  {
    path: "/forbidden",
    element: withSuspense(<ForbiddenPage />),
  },
  {
    path: "*",
    element: withSuspense(<NotFoundPage />),
  },
]);

export default router;
