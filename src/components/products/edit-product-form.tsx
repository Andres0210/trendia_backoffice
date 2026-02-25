"use client";

import { useForm } from "react-hook-form";
import { Product } from "@/types/product.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "@/services/product.service";

interface Props {
  product: Product;
  onSuccess: () => void;
}

export function EditProductForm({ product, onSuccess }: Props) {
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: product.name,
      description: product.description ?? "",
      sku: product.sku ?? "",
      price: product.price,
      compareAtPrice: product.compareAtPrice ?? undefined,
      cost: product.cost,
      stock: product.stock ?? undefined,
      isActive: product.isActive,
      isOnSale: product.isOnSale,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => updateProduct(product.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onSuccess();
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("name")} className="w-full border rounded-lg p-2" />
      <textarea
        {...register("description")}
        className="w-full border rounded-lg p-2"
      />
      <input {...register("sku")} className="w-full border rounded-lg p-2" />

      <div className="grid grid-cols-3 gap-4">
        <input
          type="number"
          {...register("price", { valueAsNumber: true })}
          className="border rounded-lg p-2"
        />
        <input
          type="number"
          {...register("compareAtPrice", { valueAsNumber: true })}
          className="border rounded-lg p-2"
        />
        <input
          type="number"
          {...register("cost", { valueAsNumber: true })}
          className="border rounded-lg p-2"
        />
      </div>

      <input
        type="number"
        {...register("stock", { valueAsNumber: true })}
        className="border rounded-lg p-2 w-full"
      />

      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("isActive")} />
          Activo
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("isOnSale")} />
          En oferta
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-zinc-900 text-white py-2 rounded-xl"
      >
        Guardar cambios
      </button>
    </form>
  );
}
