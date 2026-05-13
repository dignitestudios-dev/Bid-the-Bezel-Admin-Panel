import { useApiMutation } from "@/hooks/use-api-mutation";
import { apiClient } from "@/lib/api/axios";
import { showError, showSuccess } from "@/lib/toast";
import { useQuery } from "@tanstack/react-query";

export const useGetFixedPrice = (
  page: number,
  search: string,
  status: string,
) => {
  return useQuery({
    queryKey: ["get-fixed-price", page, search, status],
    queryFn: async () => {
      const res = await apiClient.get(
        `admin/products/fixed-price?page=${page}&limit=10&search=${search || ""}&status=${status || "all"}`,
      );
      return res.data;
    },
  });
};
export const useGetFixedPriceStats = () => {
  return useQuery({
    queryKey: ["get-fixed-price-stats"],
    queryFn: async () => {
      const res = await apiClient.get(`/admin/products/fixed-price/stats`);
      return res.data;
    },
  });
};
export const useGetFixedPriceById = (productId: string) => {
  return useQuery({
    queryKey: ["get-fixed-priceById", productId],
    queryFn: async () => {
      const res = await apiClient.get(`/admin/products/${productId}`);
      return res.data;
    },
  });
};

export const useDeleteProduct = () =>
  useApiMutation<any, { productId: string }>({
    endpoint: ({ productId }) => `/admin/products/${productId}/deactivate`,

    invalidateKeys: [
      "get-fixed-price",
      "get-fixed-price-stats",
      "get-fixed-priceById",
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
