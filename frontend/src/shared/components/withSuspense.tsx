import { Suspense, type ReactNode } from "react";
import { RouteLoader } from "@/shared/components/RouteLoader";

export const withSuspense = (element: ReactNode) => (
  <Suspense fallback={<RouteLoader />}>{element}</Suspense>
);
