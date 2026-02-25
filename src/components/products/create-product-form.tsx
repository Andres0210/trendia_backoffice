"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "@/services/product.service";

const schema = z
  .object({
    name: z.string().min(2, "El nombre es obligatorio"),
    description: z.string().optional(),
    sku: z.string().optional(),
    price: z.number().positive("El precio debe ser mayor que 0"),
    compareAtPrice: z.number().min(0, "Debe ser >= 0").optional(),
    cost: z.number().min(0, "El costo debe ser >= 0"),
    stock: z.number().int().min(0, "Stock debe ser >= 0").optional(),
    isActive: z.boolean().optional(),
    isOnSale: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.compareAtPrice === undefined || data.compareAtPrice >= data.price,
    {
      message: "compareAtPrice no puede ser menor que price",
      path: ["compareAtPrice"],
    },
  );

type FormData = z.infer<typeof schema>;

interface Props {
  onSuccess: () => void;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

const money = (n: number) => `$${(n ?? 0).toLocaleString("es-CO")}`;

export function CreateProductForm({ onSuccess }: Props) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      price: 0,
      compareAtPrice: undefined,
      cost: 0,
      stock: undefined,
      isActive: true,
      isOnSale: false,
    },
  });

  const price = watch("price") || 0;
  const cost = watch("cost") || 0;
  const profit = price - cost;

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onSuccess();
    },
  });

  const onSubmit = (data: FormData) => {
    // Limpieza de payload: no mandes strings vacíos ni undefined innecesarios
    const payload: any = {
      name: data.name,
      price: data.price,
      cost: data.cost,
      isActive: data.isActive ?? true,
      isOnSale: data.isOnSale ?? false,
    };

    if (data.description?.trim()) payload.description = data.description.trim();
    if (data.sku?.trim()) payload.sku = data.sku.trim();
    if (typeof data.stock === "number") payload.stock = data.stock;
    if (typeof data.compareAtPrice === "number")
      payload.compareAtPrice = data.compareAtPrice;

    mutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Nombre */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-900">Nombre</label>
        <input
          placeholder="Ej: Espátula Ultrasónica Facial"
          {...register("name")}
          className={[
            "w-full rounded-lg border bg-zinc-50 px-3 py-2 text-sm text-zinc-900",
            "outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-300",
            errors.name ? "border-red-300 bg-red-50" : "border-zinc-200",
          ].join(" ")}
        />
        <FieldError message={errors.name?.message} />
      </div>

      {/* Descripción */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-900">Descripción</label>
        <textarea
          rows={6}
          placeholder="Descripción del producto (opcional)"
          {...register("description")}
          className={[
            "w-full rounded-lg border bg-zinc-50 px-3 py-2 text-sm text-zinc-900",
            "outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-300",
            errors.description ? "border-red-300 bg-red-50" : "border-zinc-200",
          ].join(" ")}
        />
        <FieldError message={errors.description?.message} />
      </div>

      {/* SKU + Stock */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-900">SKU</label>
          <input
            placeholder="Ej: TRE-001"
            {...register("sku")}
            className={[
              "w-full rounded-lg border bg-zinc-50 px-3 py-2 text-sm text-zinc-900",
              "outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-300",
              errors.sku ? "border-red-300 bg-red-50" : "border-zinc-200",
            ].join(" ")}
          />
          <FieldError message={errors.sku?.message} />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-900">Stock</label>
          <input
            type="number"
            placeholder="Ej: 10"
            {...register("stock", { valueAsNumber: true })}
            className={[
              "w-full rounded-lg border bg-zinc-50 px-3 py-2 text-sm text-zinc-900",
              "outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-300",
              errors.stock ? "border-red-300 bg-red-50" : "border-zinc-200",
            ].join(" ")}
          />
          <FieldError message={errors.stock?.message} />
        </div>
      </div>

      {/* Precio / compareAt / costo */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-900">Precio</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
              $
            </span>
            <input
              type="number"
              placeholder="0"
              {...register("price", { valueAsNumber: true })}
              className={[
                "w-full rounded-lg border bg-zinc-50 pl-7 pr-3 py-2 text-sm text-zinc-900",
                "outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-300",
                errors.price ? "border-red-300 bg-red-50" : "border-zinc-200",
              ].join(" ")}
            />
          </div>
          <FieldError message={errors.price?.message} />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-900">
            CompareAt{" "}
            <span className="text-zinc-500 font-normal">(opcional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
              $
            </span>
            <input
              type="number"
              placeholder="0"
              {...register("compareAtPrice", { valueAsNumber: true })}
              className={[
                "w-full rounded-lg border bg-zinc-50 pl-7 pr-3 py-2 text-sm text-zinc-900",
                "outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-300",
                errors.compareAtPrice
                  ? "border-red-300 bg-red-50"
                  : "border-zinc-200",
              ].join(" ")}
            />
          </div>
          <FieldError message={errors.compareAtPrice?.message} />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-900">Costo</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
              $
            </span>
            <input
              type="number"
              placeholder="0"
              {...register("cost", { valueAsNumber: true })}
              className={[
                "w-full rounded-lg border bg-zinc-50 pl-7 pr-3 py-2 text-sm text-zinc-900",
                "outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-300",
                errors.cost ? "border-red-300 bg-red-50" : "border-zinc-200",
              ].join(" ")}
            />
          </div>
          <FieldError message={errors.cost?.message} />
        </div>
      </div>

      {/* Resumen + switches */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-zinc-600">Ganancia estimada</span>
            <span
              className={[
                "font-semibold tabular-nums",
                profit >= 0 ? "text-green-700" : "text-red-700",
              ].join(" ")}
            >
              {money(profit)}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-zinc-900">Activo</div>
              <div className="text-xs text-zinc-500">
                Visible en el catálogo
              </div>
            </div>
            <input
              type="checkbox"
              {...register("isActive")}
              className="h-4 w-4 accent-zinc-900"
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-zinc-900">En oferta</div>
              <div className="text-xs text-zinc-500">Marca promocional</div>
            </div>
            <input
              type="checkbox"
              {...register("isOnSale")}
              className="h-4 w-4 accent-zinc-900"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full rounded-xl bg-zinc-900 text-white py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {mutation.isPending ? "Creando..." : "Crear producto"}
      </button>

      {mutation.isError && (
        <p className="text-sm text-red-600">
          Error creando el producto. Si el SKU ya existe, cambia el SKU.
        </p>
      )}
    </form>
  );
}
