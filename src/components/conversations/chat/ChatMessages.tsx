/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";

type Props = {
  messages: any[];
};

function getMessageDate(msg: any) {
  return new Date(msg.createdAt || msg.timestamp || msg.time || Date.now());
}

function formatTime(msg: any) {
  const date = getMessageDate(msg);

  return date.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDayKey(date: Date) {
  return date.toISOString().split("T")[0];
}

function formatDateSeparator(date: Date) {
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isToday) return "Hoy";
  if (isYesterday) return "Ayer";

  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

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

        const prevMsg = messages[i - 1];

        const showDate =
          !prevMsg ||
          getDayKey(getMessageDate(prevMsg)) !== getDayKey(getMessageDate(msg));

        return (
          <div key={msg.id ?? `${msg.timestamp}-${i}`}>
            {/* separador de fecha */}
            {showDate && (
              <div className="flex justify-center my-4">
                <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  {formatDateSeparator(getMessageDate(msg))}
                </span>
              </div>
            )}

            <div className={`flex ${isUser ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                  isUser
                    ? "bg-muted text-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">
                  {msg.textBody}
                </p>

                <div
                  className={`text-[10px] mt-1 text-right ${
                    isUser
                      ? "text-muted-foreground"
                      : "text-primary-foreground/70"
                  }`}
                >
                  {formatTime(msg)}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div ref={messagesEndRef} />
    </div>
  );
}
