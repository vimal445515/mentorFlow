import { isAxiosError } from "axios";
import { logout } from "@/features/auth/api/authApi";
import { showAlert } from "@/shared/components/alertBox";
import type { ToastType } from "@/shared/components/Toast";
import type { NavigateFunction } from "react-router-dom";

export async function handleAdminLogout(
  navigate: NavigateFunction,
  showToast: (message: string, type?: ToastType, title?: string) => void,
): Promise<void> {
  const confirmation = await showAlert(
    "ADMIN",
    "Logout!",
    "Are you sure you want to log out of this account?",
    "question",
    "Confirm",
    "Cancel",
  );

  if (!confirmation.isConfirmed) {
    return;
  }

  try {
    await logout();
    showToast("Logged out successfully.", "info");
  } catch (error) {
    const message = isAxiosError<{ message?: string }>(error)
      ? (error.response?.data?.message ?? error.message ?? "Could not log out.")
      : error instanceof Error
        ? error.message
        : "Could not log out.";
    showToast(message, "error", "Logout Failed");
  } finally {
    navigate("/admin-login");
  }
}
