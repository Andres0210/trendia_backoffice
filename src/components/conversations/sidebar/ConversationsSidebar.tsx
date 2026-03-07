/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import ConversationItem from "./ConversationItem";
import ConversationSearch from "./ConversationSearch";
import ConversationFilters from "./ConversationFilters";

type Props = {
  conversations: any[];
  isLoading: boolean;
  activeConversation: any;
  onSelectConversation: (conv: any) => void;
};

export default function ConversationsSidebar({
  conversations,
  isLoading,
  activeConversation,
  onSelectConversation,
}: Props) {

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const filtered = conversations
    ?.filter((conv) => {
      const name = conv.user?.firstName || "";
      const phone = conv.user?.phone || "";
      const text = `${name} ${phone}`.toLowerCase();

      return text.includes(search.toLowerCase());
    })
    .filter((conv) => {
      if (filter === "unread") return conv.unreadCount > 0;
      if (filter === "read") return !conv.unreadCount;
      return true;
    });

  return (
    <div className="w-[340px] border-r border-border bg-muted/20 flex flex-col">

      {/* HEADER */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg">Inbox</h2>
        <p className="text-xs text-muted-foreground">
          Conversaciones de WhatsApp
        </p>
      </div>

      {/* BUSCADOR */}
      <ConversationSearch value={search} onChange={setSearch} />

      {/* FILTROS */}
      <ConversationFilters active={filter} onChange={setFilter} />

      {/* LISTA */}
      <div className="divide-y overflow-y-auto flex-1">

        {isLoading && (
          <div className="p-4 text-sm text-muted-foreground">
            Cargando conversaciones...
          </div>
        )}

        {filtered?.map((conv: any) => {

          const name = conv.user?.firstName;
          const phone = conv.user?.phone;

          const lastMessage =
            conv.messages?.[0]?.textBody || "Sin mensajes";

          const lastMessageTime = conv.lastMessageAt
            ? new Date(conv.lastMessageAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          return (
            <ConversationItem
              key={conv.id}
              name={name}
              phone={phone}
              lastMessage={lastMessage}
              lastMessageTime={lastMessageTime}
              unread={conv.unreadCount > 0}
              active={activeConversation?.id === conv.id}
              onClick={() => onSelectConversation(conv)}
            />
          );
        })}
      </div>
    </div>
  );
}