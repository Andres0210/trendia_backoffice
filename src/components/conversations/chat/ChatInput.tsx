"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import ChatTools from "./ChatTools";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {
  conversationId: string | null;
  onSend: (text: string) => void;
};

export default function ChatInput({ conversationId, onSend }: Props) {
  const [message, setMessage] = useState("");

  function handleSend() {
    if (!message.trim()) return;

    onSend(message.trim());
    setMessage("");
  }

  if (!conversationId) return null;

  return (
    <div className="border-t border-border bg-background px-4 py-3">
      <div className="flex items-end gap-2 bg-muted/50 border border-border rounded-2xl px-3 py-2 shadow-sm">
        {/* HERRAMIENTAS */}
        <ChatTools conversationId={conversationId} />

        {/* INPUT */}
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 resize-none border-0 bg-transparent focus-visible:ring-0 text-sm px-2 py-1"
        />

        {/* BOTON ENVIAR */}
        <Button
          onClick={handleSend}
          size="icon"
          className="rounded-full h-9 w-9"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
}
