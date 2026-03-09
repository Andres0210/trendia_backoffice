/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { socket } from "@/lib/socket";
import { useConversations } from "@/hooks/useConversations";
import { api } from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import ConversationsSidebar from "@/components/conversations/sidebar/ConversationsSidebar";
import ChatPanel from "@/components/conversations/chat/ChatPanel";
import CustomerPanel from "@/components/conversations/customer/CustomerPanel";
import {
  markConversationAsRead,
  sendTextMessage,
} from "@/services/conversation.service";
import { useMe } from "@/hooks/useMe";

type Message = {
  id?: string;
  textBody?: string;
  senderType: "USER" | "ADMIN";
  timestamp: string;
  conversationId: string;
};

export default function ConversationsPage() {
  const { data: conversations, isLoading } = useConversations();
  const { data: admin } = useMe();

  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [showCustomerPanel, setShowCustomerPanel] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const queryClient = useQueryClient();

  async function loadMessages(conversationId: string) {
    const { data } = await api.get(
      `whatsapp-message/conversations/${conversationId}/messages`,
    );
    setMessages(data);
  }

  async function handleSendMessage(text: string) {
    if (!activeConversation || !admin) return;

    await sendTextMessage({
      phoneNumber: activeConversation.user.phone,
      text,
      adminId: admin.sub,
    });
  }

  // SOCKET REALTIME
  useEffect(() => {
    const handleMessage = async (msg: Message) => {
      if (msg.conversationId === activeConversationId) {
        setMessages((prev) => [...prev, msg]);
        await markConversationAsRead(msg.conversationId);
      }
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    };

    socket.on("new-message", handleMessage);

    return () => {
      socket.off("new-message", handleMessage);
    };
  }, [activeConversationId, queryClient]);

  // FILTRAR CONVERSACIONES
  const filteredConversations = useMemo(() => {
    if (!conversations) return [];

    return conversations.filter((conv: any) => {
      const name = conv.user?.firstName?.toLowerCase() || "";
      const phone = conv.user?.phone || "";

      const matchSearch =
        name.includes(search.toLowerCase()) || phone.includes(search);

      const matchTag = !tagFilter || conv.user?.tags?.includes(tagFilter);

      return matchSearch && matchTag;
    });
  }, [conversations, search, tagFilter]);

  return (
    <div className="h-[calc(100vh-120px)] flex bg-card rounded-2xl border border-border overflow-hidden">
      {/* ================= INBOX ================= */}
      <ConversationsSidebar
        conversations={filteredConversations}
        isLoading={isLoading}
        activeConversation={activeConversation}
        onSelectConversation={async (conv) => {
          setActiveConversation(conv);
          setActiveConversationId(conv.id);
          setMessages([]);
          await loadMessages(conv.id);
          await markConversationAsRead(conv.id);
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
        }}
      />
      {/* ================= CHAT ================= */}

      <ChatPanel
        activeConversation={activeConversation}
        messages={messages}
        onSendMessage={handleSendMessage}
        onToggleCustomerPanel={() => setShowCustomerPanel((prev) => !prev)}
      />

      {showCustomerPanel && (
        <CustomerPanel
          conversation={activeConversation}
          onClose={() => setShowCustomerPanel(false)}
        />
      )}
    </div>
  );
}
