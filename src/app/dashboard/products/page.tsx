/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
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

  const isActive =
    status === "all" ? undefined : status === "active" ? true : false;

  const { data, isLoading, isError } = useProducts(
    page,
    limit,
    q.trim() || undefined,
    isActive,
    undefined
  );

  useEffect(() => {
    const handler = (e: any) => setEditProduct(e.detail);
    window.addEventListener("edit-product", handler);
    return () => window.removeEventListener("edit-product", handler);
  }, []);

  if (isLoading)
    return (
      <div className="p-6 text-muted-foreground">
        Cargando productos...
      </div>
    );

  if (isError)
    return (
      <div className="p-6 text-destructive">
        Error cargando productos.
      </div>
    );

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Productos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administra tu catálogo, precios y estado.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="
            inline-flex items-center justify-center
            rounded-xl
            bg-primary
            hover:bg-primary/90
            px-5 py-2.5
            text-sm font-semibold
            text-primary-foreground
            shadow-sm
            transition-all duration-200 ease-out
            hover:-translate-y-0.5
            active:scale-[0.98]
            focus:outline-none focus:ring-2 focus:ring-ring
          "
        >
          + Crear producto
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

            {/* Search */}
            <div className="relative w-full sm:w-80">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por nombre o SKU…"
                className="
                  w-full rounded-xl
                  border border-input
                  bg-background
                  px-4 py-2.5
                  text-sm text-foreground
                  outline-none
                  transition
                  focus:ring-2 focus:ring-ring
                "
              />
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-muted-foreground">
                Estado
              </span>

              <div className="inline-flex rounded-xl border border-border bg-background p-1">

                {(["all", "active", "inactive"] as const).map((item) => (
                  <button
                    key={item}
                    onClick={() => setStatus(item)}
                    className={[
                      "px-3 py-1.5 text-xs rounded-lg transition-all duration-200",
                      status === item
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted",
                    ].join(" ")}
                  >
                    {item === "all"
                      ? "Todos"
                      : item === "active"
                      ? "Activos"
                      : "Inactivos"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Count */}
          <div className="text-sm text-muted-foreground">
            Mostrando{" "}
            <span className="font-semibold text-foreground">
              {data?.items?.length ?? 0}
            </span>{" "}
            de{" "}
            <span className="font-semibold text-foreground">
              {data?.total ?? 0}
            </span>{" "}
            productos
          </div>
        </div>
      </div>

      {/* Table */}
      {data && (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">

          <div className="flex items-center justify-between p-5 border-b border-border">
            <div>
              <div className="text-sm font-semibold text-foreground">
                Listado
              </div>
              <div className="text-xs text-muted-foreground">
                Página {data.page} de {data.pages}
              </div>
            </div>
          </div>

          <DataTable columns={productColumns} data={data.items} />

          {/* Pagination */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-5 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Página{" "}
              <span className="font-semibold text-foreground">
                {data.page}
              </span>{" "}
              de{" "}
              <span className="font-semibold text-foreground">
                {data.pages}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="
                  px-4 py-2 text-sm
                  rounded-xl
                  border border-border
                  bg-background
                  hover:bg-muted
                  transition
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
              >
                Anterior
              </button>

              <button
                disabled={page === data.pages}
                onClick={() => setPage((prev) => prev + 1)}
                className="
                  px-4 py-2 text-sm
                  rounded-xl
                  border border-border
                  bg-background
                  hover:bg-muted
                  transition
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
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