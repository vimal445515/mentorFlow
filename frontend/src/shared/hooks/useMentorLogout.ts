import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "@/features/auth/api/authApi";
import { useToast } from "@/shared/components/Toast";
import { showAlert } from "@/shared/components/alertBox";

export function useMentorLogout() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  return useCallback(async () => {
    const confirmation = await showAlert(
      "MENTOR",
      "Logout!",
      "Are you sure you want to log out of this account?",
      "question",
      "Confirm",
      "Cancel",
    );

    if (!confirmation.isConfirmed) return;

    try {
      await logout();
      showToast("Logged out successfully.", "info");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not log out.";
      showToast(message, "error", "Logout Failed");
    } finally {
      navigate("/mentor-login");
    }
  }, [navigate, showToast]);
}
