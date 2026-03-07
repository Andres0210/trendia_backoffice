/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Send } from "lucide-react";
import ChatTools from "./ChatTools";

type Props = {
  conversationId: string | null;
  onSend: (text: string) => void;
};

export default function ChatInput({ conversationId, onSend }: Props) {
  const [message, setMessage] = useState("");

  function handleSend() {
    if (!message.trim()) return;

    onSend(message);

    setMessage("");
  }

  if (!conversationId) return null;

  return (
    <div className="border-t border-border bg-background p-3">
      <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-2">
        {/* ICONOS DE HERRAMIENTAS */}
        <ChatTools conversationId={conversationId} />

        {/* INPUT */}
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-transparent outline-none text-sm px-2"
        />

        {/* BOTON ENVIAR */}
        <button
          onClick={handleSend}
          className="p-2 rounded-full hover:bg-muted transition"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
