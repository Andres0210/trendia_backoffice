/* eslint-disable @typescript-eslint/no-explicit-any */

type Props = {
  conversation: any;
};

export default function CustomerPanel({ conversation }: Props) {
  if (!conversation) {
    return (
      <div className="w-[300px] border-l border-border flex items-center justify-center text-sm text-muted-foreground">
        Sin cliente seleccionado
      </div>
    );
  }

  const name =
    conversation.user?.firstName ||
    conversation.user?.phone ||
    "Cliente";

  const phone = conversation.user?.phone || "";

  const avatarLetter = conversation.user?.firstName
    ? conversation.user.firstName.charAt(0).toUpperCase()
    : "";

  return (
    <div className="w-[300px] border-l border-border flex flex-col bg-muted/20">
      {/* HEADER */}
      <div className="p-6 border-b border-border flex flex-col items-center gap-3">
        {/* AVATAR */}
        <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-lg">
          {avatarLetter}
        </div>

        <div className="text-center">
          <div className="font-semibold">{name}</div>
          <div className="text-xs text-muted-foreground">{phone}</div>
        </div>
      </div>

      {/* INFO CLIENTE */}
      <div className="p-4 space-y-4 text-sm">

        <div>
          <div className="text-xs text-muted-foreground">Canal</div>
          <div>WhatsApp</div>
        </div>

        <div>
          <div className="text-xs text-muted-foreground">Estado</div>
          <div>Activo</div>
        </div>

        <div>
          <div className="text-xs text-muted-foreground">Tags</div>
          <div className="flex flex-wrap gap-2 mt-1">
            {/* luego vendrán de la DB */}
            <span className="text-xs px-2 py-1 rounded bg-muted">
              Cliente
            </span>
          </div>
        </div>

      </div>

      {/* NOTAS */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground mb-2">
          Notas internas
        </div>

        <textarea
          placeholder="Agregar nota del cliente..."
          className="w-full text-sm border border-border rounded-lg p-2 bg-background resize-none"
          rows={4}
        />
      </div>
    </div>
  );
}