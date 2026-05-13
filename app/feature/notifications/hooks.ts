import { useApiMutation } from "@/hooks/use-api-mutation";
import { apiClient } from "@/lib/api/axios";
import { showError, showSuccess } from "@/lib/toast";
import { useQuery } from "@tanstack/react-query";

export const useGetNotifications = (page: number, search: string) => {
  return useQuery({
    queryKey: ["get-notifications", page, search],

    queryFn: async () => {
      const res = await apiClient.get(
        `notification?page=${page}&limit=10&search=${search}`,
      );

      return res.data;
    },
  });
};

export const useNotification = () =>
  useApiMutation<any>({
    endpoint: () => `/notification`,
    invalidateKeys: ["get-notifications"],
    method: "POST",
    mutationOptions: {
      onSuccess: (res) => {
        showSuccess(res?.message);
      },
      onError: (error: any) => {
        showError(error);
      },
    },
  });
