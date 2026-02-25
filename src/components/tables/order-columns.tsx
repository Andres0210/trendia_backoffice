/* eslint-disable @typescript-eslint/no-explicit-any */
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
}: OrderColumnsProps): ColumnDef<Order, any>[] {
  return [
    {
      accessorKey: "fullName",
      header: "Cliente",
      cell: ({ row }) => {
        const order = row.original;

        return (
          <div className="flex flex-col">
            <span className="font-semibold text-foreground tracking-tight">
              {order.fullName}
            </span>
            <span className="text-xs text-muted-foreground">
              {order.phone}
            </span>
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
      id: "address",
      header: "Dirección",
      cell: ({ row }) => {
        const order = row.original;

        return (
          <div className="flex flex-col text-sm">
            <span className="font-medium text-foreground">
              {order.address}
            </span>
            <span className="text-muted-foreground">
              {order.city}, {order.department}
            </span>
            {order.addressDetails && (
              <span className="text-xs text-muted-foreground/80">
                {order.addressDetails}
              </span>
            )}
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

        if (price === null || price === undefined) {
          return (
            <div className="text-right text-xs font-medium text-amber-600">
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
          return (
            <div className="text-right text-muted-foreground">-</div>
          );
        }

        return (
          <div
            className={[
              "text-right font-semibold tabular-nums",
              profit >= 0
                ? "text-emerald-600"
                : "text-destructive",
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

        return (
          <div className="flex items-center gap-2 justify-end">
            {/* VER DETALLE */}
            <button
              onClick={() => onView(order)}
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
                hover:shadow-sm
                active:scale-[0.95]
              "
              title="Ver detalle"
            >
              <Eye className="h-4 w-4" />
            </button>

            {/* ASIGNAR PRECIO */}
            {!order.unitSalePrice && (
              <button
                onClick={() => onAssignPrice(order)}
                className="
                  inline-flex h-9 w-9 items-center justify-center
                  rounded-xl
                  border border-primary/30
                  bg-primary/10
                  text-primary
                  transition-all duration-200
                  hover:bg-primary/20
                  hover:shadow-sm
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