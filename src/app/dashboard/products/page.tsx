/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { DataTable } from "@/components/tables/data-table";
import { productColumns } from "@/components/tables/product-columns";
import { CreateProductModal } from "@/components/products/create-product-modal";
import { EditProductModal } from "@/components/products/edit-product-modal";
import { Product } from "@/types/product.types";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const limit = 10;

  // Convertimos el status del UI a isActive (backend)
  const isActive =
    status === "all" ? undefined : status === "active" ? true : false;

  // Si luego agregas filtro "en oferta", aquí va:
  const isOnSale = undefined; // o true/false

  const { data, isLoading, isError } = useProducts(
    page,
    limit,
    q.trim() ? q.trim() : undefined,
    isActive,
    isOnSale,
  );

  useEffect(() => {
    const handler = (e: any) => {
      setEditProduct(e.detail);
    };

    window.addEventListener("edit-product", handler);
    return () => window.removeEventListener("edit-product", handler);
  }, []);

  if (isLoading) return <div className="p-6">Cargando...</div>;
  if (isError) return <div className="p-6">Error cargando productos</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Productos</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Administra tu catálogo, precios y estado.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="
    inline-flex items-center justify-center
    gap-2
    rounded-xl
    bg-[var(--create-button)]
    hover:bg-[var(--create-button-hover)]
    px-5 py-2.5
    text-sm font-semibold text-primary-foreground
    shadow-lg shadow-primary/20
    cursor-pointer
    transition-all duration-200
    hover:shadow-xl hover:shadow-primary/30
    hover:-translate-y-0.5
    active:scale-[0.98]
    focus:outline-none focus:ring-2 focus:ring-ring
  "
        >
          + Crear producto
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-card border border-border rounded-2xl shadow-sm p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por nombre o SKU…"
                className="
                  w-full rounded-xl
                  border border-border
                  bg-background
                  px-4 py-2.5
                  text-sm
                  outline-none
                  focus:ring-2 focus:ring-primary/40
                  focus:border-primary
                  transition
                            "
              />
              {q.length > 0 && (
                <button
                  onClick={() => setQ("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-200/60"
                  aria-label="Limpiar búsqueda"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-600">Estado</span>
              <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-1">
                <button
                  onClick={() => setStatus("all")}
                  className={[
                    "px-3 py-1.5 text-xs rounded-md transition",
                    status === "all"
                      ? "bg-primary text-primary-foreground shadow shadow-primary/20"
                      : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
                  ].join(" ")}
                >
                  Todos
                </button>
                <button
                  onClick={() => setStatus("active")}
                  className={[
                    "px-3 py-1.5 text-xs rounded-md transition",
                    status === "active"
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-700 hover:bg-zinc-100",
                  ].join(" ")}
                >
                  Activos
                </button>
                <button
                  onClick={() => setStatus("inactive")}
                  className={[
                    "px-3 py-1.5 text-xs rounded-md transition",
                    status === "inactive"
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-700 hover:bg-zinc-100",
                  ].join(" ")}
                >
                  Inactivos
                </button>
              </div>
            </div>
          </div>

          {/* Count */}
          <div className="text-sm text-zinc-600">
            Mostrando{" "}
            <span className="font-medium text-zinc-900">
              {data?.total ?? 0}
            </span>
            de{" "}
            <span className="font-medium text-zinc-900">
              {data?.items?.length ?? 0}
            </span>{" "}
            en esta página
          </div>
        </div>
      </div>

      {/* Table Card */}
      {data && (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <div className="text-sm font-medium text-zinc-900">Listado</div>
              <div className="text-xs text-zinc-600">
                Página {data.page} de {data.pages}
              </div>
            </div>
          </div>

          <DataTable columns={productColumns} data={data.items} />

          {/* Footer / pagination */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 border-t border-zinc-200">
            <div className="text-sm text-zinc-600">
              Página{" "}
              <span className="font-medium text-zinc-900">{data.page}</span> de{" "}
              <span className="font-medium text-zinc-900">{data.pages}</span>
            </div>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="
  px-4 py-2 text-sm
  rounded-xl
  border border-border
  bg-background
  hover:bg-primary/5
  hover:text-primary
  transition
  disabled:opacity-40
"
              >
                Anterior
              </button>

              <button
                disabled={page === data.pages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateProductModal open={open} onOpenChange={setOpen} />
      <EditProductModal
        open={!!editProduct}
        product={editProduct}
        onOpenChange={() => setEditProduct(null)}
      />
    </div>
  );
}
