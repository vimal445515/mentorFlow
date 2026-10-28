import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/store/hooks";

export const UnauthorizedPage: FC = () => {
  const navigate = useNavigate();
  const {isAuthenticated,user} = useAppSelector(store=>store.auth)
   const handleGoHome = () => {
    if (!isAuthenticated) {
      navigate("/");
    } else if (user?.role === "MENTOR") {
      navigate("/mentor/profile");
    } else if (user?.role === "STUDENT") {
      navigate("/student/profile");
    }
    else if (user?.role === "ADMIN") {
      navigate("/admin");
    }
  };
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-2xl mb-4 shadow-sm">
        401
      </div>
      <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight mb-2">
        Access Denied
      </h1>
      <p className="text-neutral-600 max-w-md mb-8">
        You do not have the required permissions or role to view this resource.
      </p>
      <button
        onClick={handleGoHome}
        className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-xl transition-all shadow-sm"
      >
        Go Back
      </button>
    </div>
  );
};

export default UnauthorizedPage;
