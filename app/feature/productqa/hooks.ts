import { useApiMutation } from "@/hooks/use-api-mutation";
import { apiClient } from "@/lib/api/axios";
import { setToken } from "@/lib/cookies";
import { showError, showSuccess } from "@/lib/toast";
import { useQuery } from "@tanstack/react-query";

export const useGetQuestions = (
  id: string,
  page: number,
  limit: number = 5,
) => {
  return useQuery<any>({
    queryKey: ["get-questions", id, page, limit],
    queryFn: async () => {
      const res = await apiClient.get(
        `/productQna/${id}?page=${page}&limit=${limit}`,
      );
      return res.data;
    },
  });
};

export const useDeleteQuestion = () =>
  useApiMutation<any, { qaId: string }>({
    endpoint: ({ qaId }) => `/admin/qa/${qaId}`,
    invalidateKeys: ["get-questions"],
    method: "DELETE",
    mutationOptions: {
      onSuccess: (res) => {
        showSuccess(res?.data?.message || "Question deleted successfully.");
      },

      onError: (error) => {
        showError(error);
      },
    },
  });
