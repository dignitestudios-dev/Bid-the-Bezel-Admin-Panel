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
  failedAuction: boolean
) => {
  return useQuery({
    queryKey: [
      "get-auction",
      page,
      search,
      status,
      isReserved,
      shouldAdminIntervene,
      failedAuction
    ],
    queryFn: async () => {
      const params = new URLSearchParams();

      params.append("page", String(page));
      params.append("limit", "10");

      if (search) {
        params.append("search", search);
      }

      if (status) {
        params.append("status", status);
      }

      if (isReserved) {
        params.append("isReserved", "true");
      }

      if (shouldAdminIntervene) {
        params.append("shouldAdminIntervene", "true");
      }

      if (failedAuction) {
        params.append("failedOnly", "true");
      }

      const res = await apiClient.get(
        `admin/products/auction?${params.toString()}`
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

export const useGetAuctionBids = (auctionId: string, page: number) => {
  return useQuery({
    queryKey: ["get-auction-bids", auctionId, page],
    queryFn: async () => {
      const res = await apiClient.get(`/admin/products/${auctionId}/bids?page=${page}&limit=10`);
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
