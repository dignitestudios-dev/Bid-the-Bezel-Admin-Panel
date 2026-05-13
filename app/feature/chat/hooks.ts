import { useApiMutation } from "@/hooks/use-api-mutation";
import { apiClient } from "@/lib/api/axios";
import { showError } from "@/lib/toast";
import { useQuery } from "@tanstack/react-query";
interface GetChatRoomsPayload {
  recipientIds: string[];
  contextType?: string;
  contextId?: string;
}
export const useGetChatRooms = (params: GetChatRoomsPayload) => {
  return useQuery({
    queryKey: ["get-chat-rooms", params],

    queryFn: async () => {
      const res = await apiClient.post("/chat/rooms/direct", params);

      return res.data;
    },

    enabled: params.recipientIds.length > 0,
  });
};
export const useGetChatMessages = (roomId: string) => {
  return useQuery<any>({
    queryKey: ["get-chat-messages", roomId],
    queryFn: async () => {
      const res = await apiClient.get(`/chat/messages/${roomId}`);
      return res.data;
    },
    enabled: !!roomId,
  });
};

export const useSendMessages = (roomId: string) =>
  useApiMutation<any, { text: string; tempId: string }>({
    endpoint: `/chat/messages/${roomId}`,
    method: "POST",
    invalidateKeys: ["get-chat-messages", "get-chat-rooms"],
    mutationOptions: {
      onError: (err) => {
        showError(err);
      },
    },
  });
export const useSendMessagesMedia = (roomId: string) =>
  useApiMutation<any, FormData>({
    endpoint: `/chat/messages/${roomId}/media`,
    method: "POST",
    isMultiPart: true,
    invalidateKeys: ["get-chat-messages", "get-chat-rooms"],
    mutationOptions: {
      onError: (err) => {
        showError(err);
      },
    },
  });
