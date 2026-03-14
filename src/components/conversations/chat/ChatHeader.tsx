/* eslint-disable @typescript-eslint/no-explicit-any */

import { Phone, Info, MoreVertical } from "lucide-react"

type Props = {
  conversation: any
  onToggleCustomerPanel: () => void
}

export default function ChatHeader({
  conversation,
  onToggleCustomerPanel,
}: Props) {
  const name =
    conversation?.user?.firstName ||
    conversation?.user?.phone ||
    "Cliente"

  const phone = conversation?.user?.phone

  return (
    <div className="border-b border-border px-5 py-3 flex items-center justify-between bg-background">
      
      {/* Left */}
      <div className="flex items-center gap-3">

        {/* Avatar */}
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-semibold text-sm">
          {name?.charAt(0)?.toUpperCase()}
        </div>

        {/* User Info */}
        <div className="leading-tight">
          <p className="font-semibold text-sm">{name}</p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {phone}

            {/* status */}
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Activo ahora
            </span>
          </div>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">

        <button
          className="p-2 rounded-md hover:bg-muted transition"
        >
          <Phone size={18} />
        </button>

        <button
          onClick={onToggleCustomerPanel}
          className="p-2 rounded-md hover:bg-muted transition"
        >
          <Info size={18} />
        </button>

        <button
          className="p-2 rounded-md hover:bg-muted transition"
        >
          <MoreVertical size={18} />
        </button>

      </div>
    </div>
  )
}