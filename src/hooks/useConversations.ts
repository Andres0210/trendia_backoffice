import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";


export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data } = await api.get("whatsapp-message/conversations");
      return data;
    },
  });
}