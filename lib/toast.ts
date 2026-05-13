import { toast } from "sonner";

/**
 * Displays a success toast notification.
 * @param message - The success message to display.
 */
export const showSuccess = (message: string) => {
  toast.success(message);
};

/**
 * Displays an error toast notification.
 * Extracts the message from API error response if available.
 * @param error - The error object or message string.
 */
export const showError = (error: any) => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    (typeof error === "string" ? error : "Something went wrong. Please try again.");

  toast.error(message, {
    style: {
      background: "#fee2e2",
      color: "#b91c1c",
      border: "1px solid #fecaca",
    },
  });
};