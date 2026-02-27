"use client";

import { useEffect } from "react";
import { CreateProductForm } from "./create-product-form";

interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export function CreateProductModal({ open, onOpenChange }: Props) {
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
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="
          w-full max-w-lg
          rounded-2xl
          bg-card
          border border-border
          shadow-xl
          animate-in fade-in zoom-in-95 duration-200
        "
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5 border-b border-border">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Crear producto
              </h2>
              <p className="text-sm text-muted-foreground">
                Completa la información básica.
              </p>
            </div>

            <button
              onClick={() => onOpenChange(false)}
              className="
                h-9 w-9 rounded-xl
                hover:bg-muted
                text-muted-foreground
                transition
              "
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
