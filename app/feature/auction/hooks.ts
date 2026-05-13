import { useApiMutation } from "@/hooks/use-api-mutation";
import { apiClient } from "@/lib/api/axios";
import { showError, showSuccess } from "@/lib/toast";
import { useQuery } from "@tanstack/react-query";

export const useGetAuction = (
  page: number,
  search: string,
  status: string,
  isReserved: boolean,
  shouldAdminIntervene: boolean,
) => {
  return useQuery({
    queryKey: [
      "get-auction",
      page,
      search,
      status,
      isReserved,
      shouldAdminIntervene,
    ],
    queryFn: async () => {
      const res = await apiClient.get(
        `admin/products/auction?page=${page}&limit=10&search=${
          search || ""
        }&status=${status || "all"}&isReserved=${isReserved}&shouldAdminIntervene=${shouldAdminIntervene}`,
      );

      return res.data;
    },
  });
};
export const useGetAuctionStats = () => {
  return useQuery({
    queryKey: ["get-auction-stats"],
    queryFn: async () => {
      const res = await apiClient.get(`/admin/products/auction/stats`);
      return res.data;
    },
  });
};

export const useGetAuctionById = (productId: string) => {
  return useQuery({
    queryKey: ["get-auction-id", productId],
    queryFn: async () => {
      const res = await apiClient.get(`/admin/products/${productId}`);
      return res.data;
    },
  });
};

export const useDeleteAuction = () =>
  useApiMutation<any, { productId: string }>({
    endpoint: ({ productId }) => `/admin/products/${productId}/deactivate`,
    invalidateKeys: ["get-auction", "get-auction-stats", "get-auction-id"],
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
