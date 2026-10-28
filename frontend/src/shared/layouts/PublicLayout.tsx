import type { FC } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/shared/components/Header";

export const PublicLayout: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isRegister = location.pathname === "/register";
  const isStudentLogin = location.pathname === "/student-login" || location.pathname === "/login";
  const isMentorLogin = location.pathname === "/mentor-login";
  const isAdminLogin = location.pathname === "/admin-login";
  const isForgotPassword = location.pathname === "/forgot-password";

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        isAdminLogin ? "bg-[#0B0C0E]" : "bg-[#FAF8F5]"
      }`}
    >
      {/* Top Header for Auth & Public Pages */}
      {isRegister && (
        <Header
          rightText="Already have an account?"
          rightLinkText="Sign in &rarr;"
          onRightLinkClick={() => navigate("/student-login")}
          onLogoClick={() => navigate("/register")}
        />
      )}

      {isStudentLogin && (
        <Header
          rightText="Are you a mentor?"
          rightLinkText="Mentor Portal &rarr;"
          onRightLinkClick={() => navigate("/mentor-login")}
          onLogoClick={() => navigate("/student-login")}
        />
      )}

      {isMentorLogin && (
        <Header
          rightText="Are you a student?"
          rightLinkText="Student Portal &rarr;"
          onRightLinkClick={() => navigate("/student-login")}
          onLogoClick={() => navigate("/mentor-login")}
        />
      )}

      {isForgotPassword && (
        <Header
          rightText="Remember your password?"
          rightLinkText="Sign in &rarr;"
          onRightLinkClick={() => navigate("/student-login")}
          onLogoClick={() => navigate("/student-login")}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
