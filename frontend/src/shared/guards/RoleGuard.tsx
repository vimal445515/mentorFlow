import type { FC, ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/app/store/hooks";
import type { AuthUser } from "@/features/auth/types/auth.types";

export type UserRole = AuthUser["role"];

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children?: ReactNode;
}

export const RoleGuard: FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user || !user.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default RoleGuard;
