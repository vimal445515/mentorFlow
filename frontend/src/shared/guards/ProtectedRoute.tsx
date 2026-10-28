import type { FC, ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/app/store/hooks";

interface ProtectedRouteProps {
  children?: ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/student-login",
}) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
