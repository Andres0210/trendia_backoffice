/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import { useProducts } from "@/hooks/useProducts";
import { createOrder } from "@/services/order.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateOrderModal({
  open,
  onOpenChange,
}: CreateOrderModalProps) {
  const [userId, setUserId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [city, setCity] = useState("");
  const [department, setDepartment] = useState("");
  const [address, setAddress] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [addressDetails, setAddressDetails] = useState("");

  const queryClient = useQueryClient();

  const { data: users } = useUsers(1, 100);
  const { data: products } = useProducts(1, 100);

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      handleClose();
    },
  });

  if (!open) return null;

  const handleClose = () => {
    setUserId("");
    setProductId("");
    setQuantity(1);
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (!userId || !productId) return;

    mutation.mutate({
      userId,
      productId,
      quantity,
      supplierBaseCost: 0,
      fullName: "",
      city,
      address,
      department,
      additionalNotes: additionalNotes || undefined,
      addressDetails: addressDetails || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-lg font-semibold">Crear orden</h2>
          <p className="text-sm text-zinc-600">Selecciona cliente y producto</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm"
          >
            <option value="">Seleccionar usuario</option>
            {users?.items?.map((u: any) => (
              <option key={u.id} value={u.id}>
                {u.firstName} {u.lastName}
              </option>
            ))}
          </select>

          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm"
          >
            <option value="">Seleccionar producto</option>
            {products?.items?.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Departamento</label>
              <input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Ciudad</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Dirección</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Detalles de dirección</label>
            <input
              value={addressDetails}
              onChange={(e) => setAddressDetails(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="Ej: Apto 302, Torre 2, Barrio La Esperanza"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Notas adicionales</label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="Ej: Llamar antes de entregar, entregar en portería..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border border-zinc-200 text-sm hover:bg-zinc-100 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 transition disabled:opacity-50"
          >
            {mutation.isPending ? "Creando..." : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}
