import { useApiMutation } from "@/hooks/use-api-mutation";
import { apiClient } from "@/lib/api/axios";
import { showError, showSuccess } from "@/lib/toast";
import { useQuery } from "@tanstack/react-query";

export const useGetAuthentication = (
  page: number,
  search: string,
  status: string,
  type: string,
) => {
  return useQuery({
    queryKey: ["get-authentication", page, search, status, type],

    queryFn: async () => {
      const res = await apiClient.get(
        `admin/products/authentication-requests?page=${page}&limit=10&type=${type}&search=${search}&status=${status}`,
      );

      return res.data;
    },
  });
};

export const useGetAuthenticationStats = () => {
  return useQuery({
    queryKey: ["get-authentication-stats"],
    queryFn: async () => {
      const res = await apiClient.get(
        `/admin/products/authentication-requests/stats`,
      );
      return res.data;
    },
  });
};
export const useGetAuthenticationId = (productId: string) => {
  return useQuery({
    queryKey: ["get-authenticationById", productId],
    queryFn: async () => {
      const res = await apiClient.get(`/admin/products/${productId}`);
      return res.data;
    },
  });
};
export const useAuthenticateUser = () =>
  useApiMutation<any, { productId: string; status: "approved" | "rejected" }>({
    endpoint: ({ productId }) => `admin/products/${productId}/authentication`,
    method: "PATCH",
    invalidateKeys: ["get-authentication", "get-authenticationById"],
    mutationOptions: {
      onSuccess: (res) => {
        showSuccess(res.message);
      },
      onError: (error: any) => {
        showError(error);
      },
    },
  });
