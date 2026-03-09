/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/axios";

export const getConversations = async () => {
  const { data } = await api.get("/conversations");
  return data;
};

export const getConversationMessages = async (conversationId: string) => {
  const { data } = await api.get(
    `/whatsapp-message/conversations/${conversationId}/messages`,
  );
  return data;
};

export const sendTextMessage = async (payload: {
  phoneNumber: string;
  text: string;
  adminId: string;
}) => {
  const { data } = await api.post("/whatsapp-message/send-text-message", payload);
  return data;
};

export const markConversationAsRead = async (conversationId: string) => {
  const { data } = await api.patch(`/whatsapp-message/${conversationId}/read`);
  return data;
};
