/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";

type Props = {
  messages: any[];
};

export default function ChatMessages({ messages }: Props) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!messages?.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
        No hay mensajes todavía
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg, i) => {
        const isUser = msg.senderType === "USER";

        return (
          <div
            key={msg.id ?? `${msg.timestamp}-${i}`}
            className={`flex ${isUser ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                isUser ? "bg-muted" : "bg-primary text-primary-foreground"
              }`}
            >
              {msg.textBody}
            </div>
          </div>
        );
      })}

      <div ref={messagesEndRef} />
    </div>
  );
}
