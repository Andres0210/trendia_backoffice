/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/types/product.types";
import { useQueryClient } from "@tanstack/react-query";
import { activateProduct, deactivateProduct } from "@/services/product.service";
import { Tooltip } from "@/components/ui/tooltip";

const money = (value: number) =>
  `$${value.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Producto",
    cell: ({ row }) => (
      <div className="font-semibold text-foreground tracking-tight">
        {row.original.name}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Precio</div>,
    cell: ({ row }) => (
      <div className="text-right font-semibold text-primary tabular-nums">
        {money(row.original.price)}
      </div>
    ),
  },
  {
    accessorKey: "cost",
    header: () => <div className="text-right">Costo</div>,
    cell: ({ row }) => (
      <div className="text-right text-muted-foreground tabular-nums">
        {money(row.original.cost)}
      </div>
    ),
  },
  {
    id: "profit",
    header: () => <div className="text-right">Ganancia</div>,
    cell: ({ row }) => {
      const { price, cost } = row.original;
      const profit = price - cost;

      return (
        <div
          className={[
            "text-right font-semibold tabular-nums",
            profit >= 0 ? "text-emerald-600" : "text-destructive",
          ].join(" ")}
        >
          {money(profit)}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Estado",
    cell: ({ row }) =>
      row.original.isActive ? (
        <span
          className="
            inline-flex items-center gap-1.5
            rounded-full
            bg-primary/10
            px-3 py-1
            text-xs font-medium
            text-primary
            border border-primary/20
          "
        >
          <span className="h-2 w-2 rounded-full bg-primary" />
          Activo
        </span>
      ) : (
        <span
          className="
            inline-flex items-center gap-1.5
            rounded-full
            bg-muted
            px-3 py-1
            text-xs font-medium
            text-muted-foreground
            border border-border
          "
        >
          <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
          Inactivo
        </span>
      ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const product = row.original;
      const queryClient = useQueryClient();

      const handleToggle = async () => {
        if (product.isActive) {
          await deactivateProduct(product.id);
        } else {
          await activateProduct(product.id);
        }

        queryClient.invalidateQueries({ queryKey: ["products"] });
      };

      return (
        <div className="flex justify-end gap-2">
          {/* EDITAR */}
          <Tooltip text="Editar producto">
            <button
              type="button"
              aria-label="Editar producto"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("edit-product", { detail: product }),
                )
              }
              className="
                inline-flex h-9 w-9 items-center justify-center
                rounded-xl
                border border-border
                bg-background
                text-muted-foreground
                transition-all duration-200
                hover:bg-primary/5
                hover:text-primary
                hover:border-primary/30
                hover:shadow-md
                active:scale-[0.95]
              "
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
              </svg>
            </button>
          </Tooltip>

          {/* ACTIVAR / DESACTIVAR */}
          <Tooltip
            text={product.isActive ? "Desactivar producto" : "Activar producto"}
          >
            <button
              type="button"
              onClick={handleToggle}
              aria-label={
                product.isActive ? "Desactivar producto" : "Activar producto"
              }
              className={[
                "inline-flex h-9 w-9 items-center justify-center rounded-xl",
                "transition-all duration-200 active:scale-[0.95]",
                product.isActive
                  ? "border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
                  : "border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20",
              ].join(" ")}
            >
              {product.isActive ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M5 5l14 14" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </button>
          </Tooltip>
        </div>
      );
    },
  },
];
