import { useApiMutation } from "@/hooks/use-api-mutation";
import { apiClient } from "@/lib/api/axios";
import { showError, showSuccess } from "@/lib/toast";
import { useQuery } from "@tanstack/react-query";

export const useGetUsers = (page: number, search: string, status: string) => {
  return useQuery({
    queryKey: ["get-all-users", page, search, status],
    queryFn: async () => {
      const res = await apiClient.get(
        `/admin/users?page=${page}&limit=10&search=${search || ""}&status=${status || "all"}`,
      );
      return res.data;
    },
  });
};
export const useGetUserStats = () => {
  return useQuery({
    queryKey: ["get-user-stats"],
    queryFn: async () => {
      const res = await apiClient.get(`/admin/user-stats`);
      return res.data;
    },
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: ["get-user-by-id", userId],
    queryFn: async () => {
      const res = await apiClient.get(`/admin/users/${userId}`);
      return res.data;
    },
  });
};

export const useActiveInactiveUser = () =>
  useApiMutation<any, { userId: string }>({
    endpoint: ({ userId }) => `/admin/users/${userId}/deactivate`,

    invalidateKeys: ["get-all-users", "get-user-by-id", "get-user-stats"],

    method: "PATCH",
    mutationOptions: {
      onSuccess: () => {
        showSuccess("User status updated successfully");
      },


      onError: (error: any) => {
        showError(error);
      },
    },
  });
