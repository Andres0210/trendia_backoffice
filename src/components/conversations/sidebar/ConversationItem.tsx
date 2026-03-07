'use client'

interface Props {
  name?: string
  phone: string
  lastMessage: string
  lastMessageTime: string
  unread?: boolean
  active?: boolean
  onClick: () => void
}

export default function ConversationItem({
  name,
  phone,
  lastMessage,
  lastMessageTime,
  unread,
  active,
  onClick,
}: Props) {

  const displayName = name || phone
  const avatarLetter = name ? name.charAt(0).toUpperCase() : ''

  return (
    <div
      onClick={onClick}
      className={`flex gap-3 p-3 border-b border-border cursor-pointer transition hover:bg-muted/70 ${
        active ? 'bg-muted/80' : ''
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

          <span className="text-xs text-muted-foreground">
            {lastMessageTime}
          </span>
        </div>

        <div className="flex justify-between items-center">

          <p className="text-sm text-muted-foreground truncate">
            {lastMessage}
          </p>

          {unread && (
            <span className="ml-2 text-xs bg-green-500 text-white px-2 rounded-full">
              ●
            </span>
          )}

        </div>
      </div>
    </div>
  )
}