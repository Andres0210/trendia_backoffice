"use client";

interface Props {
  name?: string;
  phone: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
  active?: boolean;
  onClick: () => void;
}

function formatLastMessageTime(timestamp: string, unreadCount: number) {
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

  let formatted = "";

  if (isToday) {
    // Mostrar hora en formato 12h
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "p.m." : "a.m.";
    const h12 = hours % 12 === 0 ? 12 : hours % 12;
    formatted = `${h12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  } else if (isYesterday) {
    formatted = "ayer";
  } else {
    formatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  return formatted;
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
  const avatarLetter = name ? name.charAt(0).toUpperCase() : "";

  return (
    <div
      onClick={onClick}
      className={`flex gap-3 p-3 border-b border-border cursor-pointer transition hover:bg-muted/70 ${
        active ? "bg-muted/80" : ""
      }`}
    >
      {/* Avatar */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-sm font-semibold">
        {avatarLetter}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="font-medium truncate text-foreground">
            {displayName}
          </span>

          <span
            className={`text-xs ${
              unreadCount > 0 ? "text-green-500" : "text-muted-foreground"
            }`}
          >
            {formatLastMessageTime(lastMessageTime, unreadCount)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground truncate">
            {lastMessage}
          </p>

          {unreadCount > 0 && (
            <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
