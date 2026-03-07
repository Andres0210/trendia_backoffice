"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Admin } from "@/types/admin.types";
import { Tooltip } from "@/components/ui/tooltip";
import { Ban, CheckCircle2 } from "lucide-react";

type Actions = {
  onToggleActive: (a: Admin) => void;
  currentUserId?: string;
};

export const adminColumns = (actions: Actions): ColumnDef<Admin>[] => [
  {
    accessorKey: "firstName",
    header: "Administrador",
    cell: ({ row }) => {
      const a = row.original;
      const name = `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim();

      return (
        <div className="min-w-[220px]">
          <div className="font-medium text-foreground">
            {name || "Sin nombre"}
          </div>
          <div className="text-xs text-muted-foreground">{a.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.role?.name}</span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Estado",
    cell: ({ row }) => {
      const active = row.original.isActive;

      return (
        <span
          className={[
            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border",
            active
              ? "bg-success/10 text-success border-success/20"
              : "bg-destructive/10 text-destructive border-destructive/20",
          ].join(" ")}
        >
          {active ? "Activo" : "Inactivo"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const a = row.original;
      const isSelf = String(a.id) === String(actions.currentUserId);
      const iconBtn =
        "inline-flex h-9 w-9 items-center justify-center rounded-xl " +
        "transition-all duration-150 active:scale-[0.95] " +
        "hover:bg-muted border border-transparent";

      return (
        <div className="flex justify-end gap-2">
          <Tooltip
            text={
              isSelf
                ? "No puedes modificar tu propio estado"
                : a.isActive
                  ? "Desactivar"
                  : "Activar"
            }
          >
            <button
              type="button"
              disabled={isSelf}
              className={[
                iconBtn,
                isSelf
                  ? "opacity-40 cursor-not-allowed"
                  : a.isActive
                    ? "text-destructive hover:bg-destructive/10 hover:border-destructive/20"
                    : "text-success hover:bg-success/10 hover:border-success/20",
              ].join(" ")}
              onClick={() => actions.onToggleActive(a)}
            >
              {a.isActive ? (
                <Ban className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
            </button>
          </Tooltip>
        </div>
      );
    },
  },
];
