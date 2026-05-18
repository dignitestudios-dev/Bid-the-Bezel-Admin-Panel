import { useApiMutation } from "@/hooks/use-api-mutation";
import { apiClient } from "@/lib/api/axios";
import { showError, showSuccess } from "@/lib/toast";
import { useMutation, useQuery } from "@tanstack/react-query";

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



export const useDownloadOrdersCSV = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.get("/admin/reports/orders/csv", {
        responseType: "blob",
      });

      return res.data;
    },

    onSuccess: (data) => {
      const blob = new Blob([data], { type: "text/csv" });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "orders-report.csv";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  });
};
export const useDownloadTransactionsCSV = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.get(
        "/admin/reports/revenue/csv",
        { responseType: "blob" }
      );

      return res.data;
    },

    onSuccess: (data) => {
      const blob = new Blob([data], { type: "text/csv" });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "transactions-report.csv";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  });
};

export const useDownloadSubscriptionsCSV = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.get(
        "/admin/reports/subscription-history/csv",
        { responseType: "blob" }
      );

      return res.data;
    },

    onSuccess: (data) => {
      const blob = new Blob([data], { type: "text/csv" });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "subscriptions-report.csv";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  });
};