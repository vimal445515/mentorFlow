import { showAlert } from "../components/alertBox";
import { useToast } from "../components/Toast";
import { logout } from "@/features/auth/api/authApi";
import { useNavigate } from "react-router-dom";
export const handleStudentLogoutClick = async () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  try {
    showAlert(
      "STUDENT",
      "Logout!",
      "Are you shure, you want to logout this account !",
      "question",
      "Confirm",
      "Cancel",
    );
    await logout();
    showToast("Logged out successfully.", "info");
  } finally {
    navigate("/mentor-login");
  }
};
