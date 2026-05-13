import { useApiMutation } from "@/hooks/use-api-mutation";
import { apiClient } from "@/lib/api/axios";
import { showError, showSuccess } from "@/lib/toast";
import { useQuery } from "@tanstack/react-query";

export const useGetAdvertisements = (page: number, search: string) => {
  return useQuery({
    queryKey: ["get-advertisements", page, search],
    queryFn: async () => {
      const res = await apiClient.get(
        `/advertisements?page=${page}&limit=10&search=${search}`,
      );
      return res.data;
    },
  });
};
export const useGetAdvertisementsId = (advertisementId: string) => {
  return useQuery({
    queryKey: ["get-advertisements-id", advertisementId],
    queryFn: async () => {
      const res = await apiClient.get(`/advertisements/${advertisementId}`);
      return res.data;
    },
    enabled: !!advertisementId, // 🔥 important fix
  });
};
export const useAdvertisement = () =>
  useApiMutation<any>({
    endpoint: () => `/advertisements`,
    invalidateKeys: ["get-advertisements"],
    method: "POST",
    isMultiPart: true,
    mutationOptions: {
      onSuccess: (res) => {
        showSuccess(res?.message);
      },
      onError: (error: any) => {
        showError(error);
      },
    },
  });

export const useUpdateAdvertisement = () =>
  useApiMutation<any>({
    endpoint: (variables: any) =>
      `/advertisements/${variables.advertisementId}`,
    method: "PATCH",
    isMultiPart: true,
    toBody: (variables: any) => variables.data,
    invalidateKeys: ["get-advertisements"],
    mutationOptions: {
      onSuccess: (res) => {
        showSuccess(res?.message);
      },
      onError: (error: any) => {
        showError(error);
      },
    },
  });

export const useDeleteAdvertisement = () =>
  useApiMutation<any, string>({
    endpoint: (id) => `/advertisements/${id}`,
    method: "DELETE",
    invalidateKeys: ["get-advertisements"],
    toBody: () => undefined,

    mutationOptions: {
      onSuccess: (res) => showSuccess(res?.message),
      onError: (error: any) => showError(error),
    },
  });
