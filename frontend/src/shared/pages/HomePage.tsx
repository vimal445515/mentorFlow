import type { FC } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/app/store/hooks";

export const HomePage: FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/student-login" replace />;
  }

  const destination = user?.role === "MENTOR" ? "/mentor/profile" : "/student/profile";
  return <Navigate to={destination} replace />;
};

export default HomePage;
