import type { FC, ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/app/store/hooks";

interface GuestGuardProps {
  children?: ReactNode;
}

export const GuestGuard: FC<GuestGuardProps> = ({ children }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    const isMentor = user?.role === "MENTOR";
    const isAdmin = user?.role === "ADMIN";
    const destination = isAdmin
      ? "/mentor/profile"
      : isMentor
        ? "/mentor/profile"
        : "/student/profile";
    return <Navigate to={destination} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default GuestGuard;
