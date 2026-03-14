"use client";

import { cn } from "@/lib/utils";

interface Props {
  name?: string;
  phone: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
  active?: boolean;
  onClick: () => void;
}

function formatLastMessageTime(timestamp: string) {
  const date = new Date(timestamp);
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

  if (isToday) {
    return date.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (isYesterday) return "Ayer";

  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export default function ConversationItem({
  name,
  phone,
  lastMessage,
  lastMessageTime,
  unreadCount = 0,
  active,
  onClick,
}: Props) {
  const displayName = name || phone;
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b",
        "hover:bg-muted/60",
        active && "bg-muted",
      )}
    >
      {/* Avatar */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold">
        {avatarLetter}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "truncate text-sm",
              unreadCount > 0
                ? "font-semibold text-foreground"
                : "font-medium text-foreground",
            )}
          >
            {displayName}
          </span>

          <span
            className={cn(
              "text-xs",
              unreadCount > 0
                ? "text-green-600 font-medium"
                : "text-muted-foreground",
            )}
          >
            {formatLastMessageTime(lastMessageTime)}
          </span>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-0.5">
          <p
            className={cn(
              "text-sm truncate",
              unreadCount > 0
                ? "text-foreground font-medium"
                : "text-muted-foreground",
            )}
          >
            {lastMessage}
          </p>

          {unreadCount > 0 && (
            <span className="ml-2 min-w-[20px] h-5 px-1 flex items-center justify-center text-xs font-medium bg-green-500 text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
