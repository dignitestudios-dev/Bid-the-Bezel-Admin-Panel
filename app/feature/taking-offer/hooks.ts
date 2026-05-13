import { useApiMutation } from "@/hooks/use-api-mutation";
import { apiClient } from "@/lib/api/axios";
import { showError, showSuccess } from "@/lib/toast";
import { useQuery } from "@tanstack/react-query";

export const useGetTakingOffer = (
  page: number,
  search: string,
  status: string,
) => {
  return useQuery({
    queryKey: ["get-taking-offer", page, search, status],
    queryFn: async () => {
      const res = await apiClient.get(
        `admin/products/taking-offers?page=${page}&limit=10&search=${search || ""}&status=${status || "all"}`,
      );
      return res.data;
    },
  });
};
export const useGetTakingOfferStats = () => {
  return useQuery({
    queryKey: ["get-taking-offer-stats"],
    queryFn: async () => {
      const res = await apiClient.get(`/admin/products/taking-offers/stats`);
      return res.data;
    },
  });
};

export const useGetTakingOfferById = (productId: string) => {
  return useQuery({
    queryKey: ["get-taking-offer-id", productId],
    queryFn: async () => {
      const res = await apiClient.get(`/admin/products/${productId}`);
      return res.data;
    },
  });
};

export const useDeleteTakingOffer = () =>
  useApiMutation<any, { productId: string }>({
    endpoint: ({ productId }) => `/admin/products/${productId}/deactivate`,
    invalidateKeys: [
      "get-taking-offer",
      "get-taking-offer-stats",
      "get-taking-offer-id",
    ],
    method: "PATCH",
    mutationOptions: {
      onSuccess: (res) => {
        showSuccess(res?.message);
      },
      onError: (error: any) => {
        showError(error);
      },
    },
  });
