"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/tables/data-table";
import { orderColumns } from "@/components/tables/order-columns";
import { Order } from "@/types/order.types";
import { deleteOrder, assignOrderPrice } from "@/services/order.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AssignPriceModal } from "@/components/orders/assign-price-modal";
import { CreateOrderModal } from "@/components/orders/create-order-modal";
import { useOrders } from "@/hooks/useOrder";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [assignOrder, setAssignOrder] = useState<Order | null>(null);

  const limit = 10;
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, isError } = useOrders(page, limit);

  const filteredItems = useMemo(() => {
    const items = data?.data ?? [];
    const query = q.trim().toLowerCase();

    return items.filter((o: Order) => {
      return (
        !query ||
        o.fullName.toLowerCase().includes(query) ||
        o.productName.toLowerCase().includes(query) ||
        o.phone.includes(query)
      );
    });
  }, [data?.data, q]);

  const assignMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { unitSalePrice: number; discountReason?: string };
    }) => assignOrderPrice(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  if (isLoading)
    return (
      <div className="p-10 text-center text-muted-foreground">
        Cargando órdenes...
      </div>
    );

  if (isError)
    return (
      <div className="p-10 text-center text-destructive">
        Error cargando órdenes
      </div>
    );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary">
            Órdenes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestión de pedidos creados y su estado comercial.
          </p>
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          className="
            inline-flex items-center justify-center
            rounded-xl
            bg-[var(--create-button)]
            hover:bg-[var(--create-button-hover)]
            px-5 py-2.5
            text-sm font-medium
            text-primary-foreground
            shadow-md
            transition-all duration-200
            hover:shadow-lg
            hover:scale-[1.02]
            active:scale-[0.98]
          "
        >
          + Crear orden
        </button>
      </div>

      {/* TOOLBAR */}
      <div
        className="
          rounded-2xl
          border border-border
          bg-background
          p-5
          shadow-sm
          flex flex-col gap-4
          sm:flex-row sm:items-center sm:justify-between
        "
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por cliente, producto o teléfono..."
          className="
            w-full sm:max-w-sm
            rounded-xl
            border border-border
            bg-muted
            px-4 py-2.5
            text-sm
            text-foreground
            outline-none
            transition-all
            focus:border-primary/40
            focus:ring-2 focus:ring-primary/20
          "
        />

        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            {filteredItems.length}
          </span>{" "}
          órdenes en esta página
        </div>
      </div>

      {/* TABLE CARD */}
      {data && (
        <div
          className="
            rounded-2xl
            border border-border
            bg-background
            shadow-sm
            overflow-hidden
          "
        >
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-border bg-muted/40">
            <div className="text-sm font-medium text-foreground">
              Listado de órdenes
            </div>
          </div>

          {/* Data Table */}
          <DataTable<Order>
            columns={orderColumns({
              onAssignPrice: (order) => setAssignOrder(order),
              onView: (order) =>
                router.push(`/dashboard/orders/${order.id}`),
            })}
            data={filteredItems}
          />

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30">
            <div className="text-sm text-muted-foreground">
              Página{" "}
              <span className="font-semibold text-foreground">
                {data.page}
              </span>{" "}
              de{" "}
              <span className="font-semibold text-foreground">
                {data.lastPage}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="
                  inline-flex items-center justify-center
                  rounded-xl
                  border border-border
                  bg-background
                  px-4 py-2
                  text-sm font-medium
                  text-muted-foreground
                  transition-all
                  hover:bg-primary/5
                  hover:text-primary
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                "
              >
                Anterior
              </button>

              <button
                disabled={page === data.lastPage}
                onClick={() => setPage((p) => p + 1)}
                className="
                  inline-flex items-center justify-center
                  rounded-xl
                  border border-border
                  bg-background
                  px-4 py-2
                  text-sm font-medium
                  text-muted-foreground
                  transition-all
                  hover:bg-primary/5
                  hover:text-primary
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                "
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALES */}
      <CreateOrderModal open={openCreate} onOpenChange={setOpenCreate} />

      <AssignPriceModal
        open={!!assignOrder}
        order={assignOrder}
        onOpenChange={() => setAssignOrder(null)}
        onSubmit={(payload) =>
          assignMutation.mutate({
            id: assignOrder!.id,
            payload,
          })
        }
      />
    </div>
  );
}