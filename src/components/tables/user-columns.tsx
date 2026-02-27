"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/user.types";
import { Tooltip } from "@/components/ui/tooltip";
import { Pencil, CheckCircle2, Ban, Eye } from "lucide-react";

type Actions = {
  onEdit: (u: User) => void;
  onToggleActive: (u: User) => void;
  onView: (u: User) => void;
};

export const userColumns = (actions: Actions): ColumnDef<User>[] => [
  {
    accessorKey: "firstName",
    header: "Cliente",
    cell: ({ row }) => {
      const u = row.original;
      const name = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();

      return (
        <div className="min-w-[220px]">
          <div className="font-medium text-foreground">
            {name || "Sin nombre"}
          </div>
          <div className="text-xs text-muted-foreground">
            {u.phone ?? "—"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.email ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.original.tags ?? [];

      if (!tags.length)
        return (
          <span className="text-muted-foreground">—</span>
        );

      return (
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="
                inline-flex items-center
                rounded-full
                bg-muted
                px-2.5 py-1
                text-xs font-medium
                text-foreground
                border border-border
              "
            >
              {t}
            </span>
          ))}

          {tags.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{tags.length - 3}
            </span>
          )}
        </div>
      );
    },
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
      const u = row.original;

      const iconBtn =
        "inline-flex h-9 w-9 items-center justify-center rounded-xl " +
        "transition-all duration-150 active:scale-[0.95] " +
        "hover:bg-muted border border-transparent";

      return (
        <div className="flex justify-end gap-2">

          <Tooltip text="Ver perfil">
            <button
              type="button"
              className={iconBtn + " text-muted-foreground hover:text-foreground"}
              onClick={() => actions.onView(u)}
              aria-label="Ver perfil"
            >
              <Eye className="h-4 w-4" />
            </button>
          </Tooltip>

          <Tooltip text="Editar">
            <button
              type="button"
              className={iconBtn + " text-muted-foreground hover:text-foreground"}
              onClick={() => actions.onEdit(u)}
              aria-label="Editar"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </Tooltip>

          <Tooltip text={u.isActive ? "Desactivar" : "Activar"}>
            <button
              type="button"
              className={[
                iconBtn,
                u.isActive
                  ? "text-destructive hover:bg-destructive/10 hover:border-destructive/20"
                  : "text-success hover:bg-success/10 hover:border-success/20",
              ].join(" ")}
              onClick={() => actions.onToggleActive(u)}
              aria-label={u.isActive ? "Desactivar" : "Activar"}
            >
              {u.isActive ? (
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