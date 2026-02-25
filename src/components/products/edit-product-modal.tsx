"use client";

import { useEffect } from "react";
import { Product } from "@/types/product.types";
import { EditProductForm } from "./edit-product-form";

interface Props {
  open: boolean;
  product: Product | null;
  onOpenChange: (value: boolean) => void;
}

export function EditProductModal({ open, product, onOpenChange }: Props) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-zinc-200">
          <div className="flex justify-between items-center px-6 py-5 border-b">
            <h2 className="text-lg font-semibold text-zinc-900">
              Editar producto
            </h2>

            <button
              onClick={() => onOpenChange(false)}
              className="h-9 w-9 rounded-lg hover:bg-zinc-100 grid place-items-center"
            >
              ✕
            </button>
          </div>

          <div className="px-6 py-6">
            <EditProductForm
              product={product}
              onSuccess={() => onOpenChange(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
