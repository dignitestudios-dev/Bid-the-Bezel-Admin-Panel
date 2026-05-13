import { useApiMutation } from "@/hooks/use-api-mutation";
import { LoginPayload, OtpPayload, updatePasswordPayload } from "./schema";
import { setToken, setUser } from "@/lib/cookies";
import { showError, showSuccess } from "@/lib/toast";

export const useLogin = () =>
  useApiMutation<any, LoginPayload>({
    endpoint: "/admin/login",
    method: "POST",
    // invalidateKeys: [
    //   "get-profile",
    //   "get-listing-detail",
    //   "get-home-listing",
    //   "get-notifications",
    // ],
    mutationOptions: {
      onSuccess: (data) => {
        const token = data?.data?.token;
        if (token) {
          setToken(token);
          setUser({
            id: data?.data?.admin?._id,
            email: data?.data?.admin?.email,
            name: data?.data?.admin?.name,
          });
        }

        localStorage.setItem("email", data.data.admin.email);
      },
      onError: (error) => {
        showError(error);
      },
    },
  });
export const useForgotPassword = () =>
  useApiMutation<any, any>({
    endpoint: "/admin/forgot-password",
    method: "POST",
    mutationOptions: {
      onSuccess: (data) => {
        const token = data?.data?.token;
        if (token) {
          setToken(token);
        }
      },
      onError: (error) => {
        showError(error);
      },
    },
  });

export const useForgotOtpVerify = () =>
  useApiMutation<any, OtpPayload>({
    endpoint: "/auth/verify-otp",
    method: "POST",
    mutationOptions: {
      onSuccess: (data) => {
        showSuccess(
          "OTP verified successfully. You can now reset your password.",
        );
      },
      onError: (error) => {
        showError(error);
      },
    },
  });

export const useUpdatePassword = () =>
  useApiMutation<void, updatePasswordPayload>({
    endpoint: "/auth/update-password",
    method: "POST",
  });
