"use client";

import { useMemo, useState } from "react";
import { Order } from "@/types/order.types";

interface AssignPriceModalProps {
  open: boolean;
  order: Order | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: {
    unitSalePrice: number;
    discountReason?: string;
  }) => void;
}

export function AssignPriceModal({
  open,
  order,
  onOpenChange,
  onSubmit,
}: AssignPriceModalProps) {
  const [unitSalePrice, setUnitSalePrice] = useState("");
  const [discountReason, setDiscountReason] = useState("");

  const numericPrice = Number(unitSalePrice);

  const calculations = useMemo(() => {
    if (!order || !numericPrice || numericPrice <= 0) return null;

    const subtotal = numericPrice * order.quantity;

    const total = subtotal + (order.otherCosts ?? 0);

    const profit =
      total -
      (order.supplierBaseCost +
        order.shippingCost +
        (order.carrierCommission ?? 0) +
        (order.otherCosts ?? 0));

    const discountAmount =
      order.listPrice > numericPrice ? order.listPrice - numericPrice : 0;

    return {
      subtotal,
      total,
      profit,
      discountAmount,
    };
  }, [numericPrice, order]);

  const isLoss = calculations ? calculations.profit < 0 : false;

  const handleSubmit = () => {
    if (!order) return;
    if (!numericPrice || numericPrice <= 0) return;

    onSubmit({
      unitSalePrice: numericPrice,
      discountReason: discountReason || undefined,
    });

    onOpenChange(false);
  };

  // 🔐 El return null va después de todos los hooks
  if (!open || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-xl">
        <div>
          <h2 className="text-lg font-semibold">Asignar precio de venta</h2>
          <p className="text-sm text-zinc-600">
            {order.productName} · x{order.quantity}
          </p>
        </div>

        <div className="text-sm space-y-1 text-zinc-700">
          <div>Precio lista: ${order.listPrice.toLocaleString()}</div>
          <div>Costo proveedor: ${order.supplierBaseCost.toLocaleString()}</div>
          <div>Envío: ${order.shippingCost.toLocaleString()}</div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Precio unitario de venta
          </label>
          <input
            type="number"
            value={unitSalePrice}
            onChange={(e) => setUnitSalePrice(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="Ej: 95000"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Motivo descuento (opcional)
          </label>
          <input
            type="text"
            value={discountReason}
            onChange={(e) => setDiscountReason(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="Ej: Cliente frecuente"
          />
        </div>

        {calculations && (
          <div className="rounded-xl bg-zinc-50 p-4 text-sm space-y-1">
            <div>Subtotal: ${calculations.subtotal.toLocaleString()}</div>
            <div>Total: ${calculations.total.toLocaleString()}</div>
            <div>
              Utilidad estimada:{" "}
              <span
                className={
                  calculations.profit >= 0
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                ${calculations.profit.toLocaleString()}
              </span>
            </div>

            {calculations.discountAmount > 0 && (
              <div className="text-orange-600">
                Descuento aplicado: $
                {calculations.discountAmount.toLocaleString()}
              </div>
            )}

            {isLoss && (
              <div className="text-red-600 font-medium">
                ⚠ Esta venta genera pérdida
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm rounded-lg border"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={!numericPrice || numericPrice <= 0}
            className="px-4 py-2 text-sm rounded-lg bg-slate-900 text-white disabled:opacity-50"
          >
            Confirmar precio
          </button>
        </div>
      </div>
    </div>
  );
}
