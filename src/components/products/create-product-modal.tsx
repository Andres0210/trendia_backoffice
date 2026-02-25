"use client";

import { useEffect } from "react";
import { CreateProductForm } from "./create-product-form";

interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export function CreateProductModal({ open, onOpenChange }: Props) {
  // Cerrar con ESC + bloquear scroll
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] animate-in fade-in duration-200">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-zinc-200 animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-start justify-between gap-4 px-6 py-5 border-b">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">
                Crear producto
              </h2>
              <p className="text-sm text-zinc-600">
                Completa la información básica.
              </p>
            </div>

            <button
              onClick={() => onOpenChange(false)}
              className="h-9 w-9 rounded-lg hover:bg-zinc-100 grid place-items-center text-zinc-600"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            <CreateProductForm onSuccess={() => onOpenChange(false)} />
          </div>
        </div>
      </div>
    </div>
  );
}
