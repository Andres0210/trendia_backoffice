"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/types/order.types";
import { Eye, DollarSign } from "lucide-react";

const money = (value: number) =>
  `$${value.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

interface OrderColumnsProps {
  onAssignPrice: (order: Order) => void;
  onView: (order: Order) => void;
}

export function orderColumns({
  onAssignPrice,
  onView,
}: OrderColumnsProps): ColumnDef<Order>[] {
  return [
    {
      accessorKey: "fullName",
      header: "Cliente",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">
              {order.fullName}
            </span>
            <span className="text-xs text-muted-foreground">{order.phone}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "productName",
      header: "Producto",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-foreground">
              {order.productName}
            </span>
            <span className="text-xs text-muted-foreground">
              x{order.quantity}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.original.status;

        return (
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
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "unitSalePrice",
      header: () => <div className="text-right">Precio venta</div>,
      cell: ({ row }) => {
        const price = row.original.unitSalePrice;

        if (!price) {
          return (
            <div className="text-right text-xs font-medium text-destructive">
              Sin asignar
            </div>
          );
        }

        return (
          <div className="text-right font-semibold text-primary tabular-nums">
            {money(price)}
          </div>
        );
      },
    },
    {
      accessorKey: "profit",
      header: () => <div className="text-right">Utilidad</div>,
      cell: ({ row }) => {
        const profit = row.original.profit;

        if (profit === null || profit === undefined) {
          return <div className="text-right text-muted-foreground">-</div>;
        }

        return (
          <div
            className={[
              "text-right font-semibold tabular-nums",
              profit >= 0 ? "text-success" : "text-destructive",
            ].join(" ")}
          >
            {money(profit)}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Fecha",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const order = row.original;

        const btn =
          "inline-flex h-9 w-9 items-center justify-center rounded-xl " +
          "border border-border bg-background text-muted-foreground " +
          "transition hover:bg-muted active:scale-[0.95]";

        return (
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => onView(order)}
              className={btn}
              title="Ver detalle"
            >
              <Eye className="h-4 w-4" />
            </button>

            {!order.unitSalePrice && (
              <button
                onClick={() => onAssignPrice(order)}
                className="
                  inline-flex h-9 w-9 items-center justify-center
                  rounded-xl
                  bg-primary
                  text-primary-foreground
                  transition hover:bg-primary/90
                  active:scale-[0.95]
                "
                title="Asignar precio"
              >
                <DollarSign className="h-4 w-4" />
              </button>
            )}
          </div>
        );
      },
    },
  ];
}
