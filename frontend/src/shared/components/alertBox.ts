import Swal, { type SweetAlertIcon, type SweetAlertResult } from "sweetalert2";

export async function showAlert(
  role: "STUDENT" | "MENTOR" | "ADMIN",
  title: string,
  message: string,
  icon: SweetAlertIcon,
  confirmButtonText: string,
  cancelButtonText: string,
): Promise<SweetAlertResult> {
  const confirmResult = await Swal.fire({
    title: title,
    text: message,
    icon: icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: role === "STUDENT" ? "#C85A32" : role === "MENTOR" ? "#3D6946" : "#990909",
    cancelButtonColor: "#78716c",
    reverseButtons: true,
    focusCancel: true,
    customClass: {
      popup: "rounded-3xl border border-stone-200",
      confirmButton: "rounded-xl font-bold px-5 py-2.5 shadow-sm",
      cancelButton: "rounded-xl font-medium px-5 py-2.5",
    },
  });

  return confirmResult;
}
