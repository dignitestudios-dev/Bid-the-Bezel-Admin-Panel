import { apiClient } from "@/lib/api/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboardStats = () => {
  return useQuery({
    queryKey: ["get-dashboard-stats"],
    queryFn: async () => {
      const res = await apiClient.get(`/admin/dashboard/stats`);
      return res.data;
    },
  });
};
export const useGetDashboardAnalytics = () => {
  return useQuery({
    queryKey: ["get-dashboard-analytics"],
    queryFn: async () => {
      const res = await apiClient.get(`/admin/dashboard/insights`);
      return res.data;
    },
  });
};
