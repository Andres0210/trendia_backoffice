/* eslint-disable @typescript-eslint/no-explicit-any */

type Props = {
  conversation: any;
  onToggleCustomerPanel: () => void;
};

export default function ChatHeader({
  conversation,
  onToggleCustomerPanel,
}: Props) {
  const name =
    conversation?.user?.firstName || conversation?.user?.phone || "Cliente";

  const phone = conversation?.user?.phone;

  return (
    <div
      className="border-b border-border p-4 flex items-center justify-between cursor-pointer"
      onClick={onToggleCustomerPanel}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-semibold">
          {name?.charAt(0)?.toUpperCase()}
        </div>

        <div>
          <p className="font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{phone}</p>
        </div>
      </div>

      {/* Aquí irán luego los botones */}
      <div className="flex gap-2">{/* Placeholder */}</div>
    </div>
  );
}
