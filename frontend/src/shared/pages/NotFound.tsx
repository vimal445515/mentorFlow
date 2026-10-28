import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/store/hooks";

export const NotFoundPage: FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

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
      <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-2xl mb-4 shadow-sm">
        404
      </div>
      <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight mb-2">
        Page Not Found
      </h1>
      <p className="text-neutral-600 max-w-md mb-8">
        Sorry, the page you are looking for does not exist or may have been moved.
      </p>
      <button
        onClick={handleGoHome}
        className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-xl transition-all shadow-sm"
      >
        Return to Dashboard
      </button>
    </div>
  );
};

export default NotFoundPage;
