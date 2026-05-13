import { apiClient } from "@/lib/api/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetReportsTransactions = (page: number, search: string) => {
  return useQuery<any>({
    queryKey: ["get-reports-transactions", page, search],
    queryFn: async () => {
      const res = await apiClient.get(
        `/admin/reports/transactions?page=${page}&limit=10`,
      );
      return res.data;
    },
  });
};
export const useGetReportsSubscriptions = (page: number, search: string) => {
  return useQuery<any>({
    queryKey: ["get-reports-subscriptions", page, search],
    queryFn: async () => {
      const res = await apiClient.get(
        `/admin/reports/subscriptions?page=${page}&limit=10`,
      );
      return res.data;
    },
  });
};
export const useGetReportsOrders = (page: number, search: string) => {
  return useQuery<any>({
    queryKey: ["get-reports-orders", page, search],
    queryFn: async () => {
      const res = await apiClient.get(
        `/admin/reports/orders?page=${page}&limit=10`,
      );
      return res.data;
    },
  });
};
