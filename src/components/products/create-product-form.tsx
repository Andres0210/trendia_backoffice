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
  return <p className="mt-1 text-xs text-destructive">{message}</p>;
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

  const inputBase =
    "w-full rounded-xl border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring";

  const inputError = "border-destructive bg-destructive/5";
  const inputNormal = "border-input";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Nombre */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Nombre</label>
        <input
          placeholder="Ej: Espátula Ultrasónica Facial"
          {...register("name")}
          className={`${inputBase} ${errors.name ? inputError : inputNormal}`}
        />
        <FieldError message={errors.name?.message} />
      </div>

      {/* Descripción */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          Descripción
        </label>
        <textarea
          rows={5}
          placeholder="Descripción del producto (opcional)"
          {...register("description")}
          className={`${inputBase} ${
            errors.description ? inputError : inputNormal
          }`}
        />
        <FieldError message={errors.description?.message} />
      </div>

      {/* SKU + Stock */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">SKU</label>
          <input
            {...register("sku")}
            className={`${inputBase} ${errors.sku ? inputError : inputNormal}`}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Stock</label>
          <input
            type="number"
            {...register("stock", { valueAsNumber: true })}
            className={`${inputBase} ${
              errors.stock ? inputError : inputNormal
            }`}
          />
          <FieldError message={errors.stock?.message} />
        </div>
      </div>

      {/* Precios */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {["price", "compareAtPrice", "cost"].map((field) => (
          <div key={field} className="space-y-1.5">
            <label className="text-sm font-medium text-foreground capitalize">
              {field === "compareAtPrice" ? "CompareAt" : field}
            </label>
            <input
              type="number"
              {...register(field as any, { valueAsNumber: true })}
              className={`${inputBase} ${
                errors[field as keyof FormData] ? inputError : inputNormal
              }`}
            />
            <FieldError
              message={errors[field as keyof FormData]?.message as string}
            />
          </div>
        ))}
      </div>

      {/* Resumen */}
      <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Ganancia estimada</span>
          <span
            className={`font-semibold tabular-nums ${
              profit >= 0 ? "text-success" : "text-destructive"
            }`}
          >
            {money(profit)}
          </span>
        </div>
      </div>

      {/* Switches */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4">
        <div>
          <div className="text-sm font-medium text-foreground">Activo</div>
          <div className="text-xs text-muted-foreground">
            Visible en el catálogo
          </div>
        </div>
        <input
          type="checkbox"
          {...register("isActive")}
          className="h-4 w-4 accent-primary"
        />
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="
          w-full rounded-xl
          bg-primary
          text-primary-foreground
          py-2.5 text-sm font-semibold
          transition hover:bg-primary/90
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {mutation.isPending ? "Creando..." : "Crear producto"}
      </button>

      {mutation.isError && (
        <p className="text-sm text-destructive">
          Error creando el producto. Si el SKU ya existe, cambia el SKU.
        </p>
      )}
    </form>
  );
}
