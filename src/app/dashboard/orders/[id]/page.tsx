/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getOrderById, updateOrderAdminFields } from "@/services/order.service";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { advanceOrderStatus } from "@/services/order.service";
import { Carrier } from "@/types/order.types";

const money = (value: number) =>
  `$${value.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;

const statusMap: Record<string, string> = {
  PENDING: "Pendiente",
  SENT_TO_SUPPLIER: "Enviada al proveedor",
  CONFIRMED_BY_SUPPLIER: "Confirmada por proveedor",
  SHIPPED: "Despachada",
  IN_TRANSIT: "En tránsito",
  DELIVERED: "Entregada",
  CANCELLED: "Cancelada",
  REJECTED: "Rechazada",
  RETURNED: "Devuelta",
};

const supplierPaymentLabel = (status?: string) => {
  switch (status) {
    case "PAID":
      return "Pagado";
    case "NOT_PAID":
      return "No pagado";
    default:
      return "No pagado";
  }
};

const customerPaymentLabel = (status?: string) => {
  switch (status) {
    case "PAID":
      return "Pagado";
    case "PENDING":
      return "Pendiente";
    case "NOT_PAID":
      return "No pagado";
    default:
      return "Pendiente";
  }
};

export default function OrderDetailPage() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") ?? "info";

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => advanceOrderStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateOrderAdminFields(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });

      setEditingSupplierPayment(false);
      setEditingCommission(false);
      setEditingCustomerPayment(false);
      setEditingCarrier(false);
    },
  });

  const setTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [editOrder, setEditOrder] = useState<any>(null);

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });

  // 🔥 ADMIN EDIT STATES

  const [editingCarrier, setEditingCarrier] = useState(false);
  const [carrierValue, setCarrierValue] = useState<Carrier>(
    order?.carrier ?? Carrier.INTERRAPIDISIMO,
  );

  const [editingSupplierPayment, setEditingSupplierPayment] = useState(false);
  const [supplierPaymentValue, setSupplierPaymentValue] = useState(
    order?.supplierPaymentStatus ?? "NOT_PAID",
  );

  const [editingCommission, setEditingCommission] = useState(false);
  const [commissionValue, setCommissionValue] = useState(
    order?.carrierCommission ?? 0,
  );

  const [editingCustomerPayment, setEditingCustomerPayment] = useState(false);
  const [customerPaymentValue, setCustomerPaymentValue] = useState(
    order?.customerPaymentStatus,
  );

  if (isLoading) return <div className="p-6">Cargando orden...</div>;
  if (isError || !order) return <div className="p-6">Error cargando orden</div>;

  const paymentMethodLabel =
    order.paymentMethod === "CASH_ON_DELIVERY"
      ? "Pago contra entrega"
      : order.paymentMethod === "PREPAID_TRANSFER"
        ? "Transferencia anticipada"
        : "No asignado";

  const carrierLabel = order.carrier ?? "No se ha asignado transportadora";

  const additionalNotes =
    order.additionalNotes?.trim() || "El cliente no agregó notas adicionales.";

  const internalNotes =
    order.internalNotes?.trim() || "No hay notas internas registradas.";

  const carrierCommissionSection = () => {
    if (editingCommission) {
      return (
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={commissionValue}
            onChange={(e) => setCommissionValue(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 text-sm w-32"
          />

          <button
            onClick={() =>
              updateMutation.mutate({
                carrierCommission: commissionValue,
              })
            }
            className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs"
          >
            Guardar
          </button>

          <button
            onClick={() => setEditingCommission(false)}
            className="text-xs text-zinc-500"
          >
            Cancelar
          </button>
        </div>
      );
    }

    return (
      <div className="flex justify-between items-center">
        <span>
          {order.carrierCommission
            ? money(order.carrierCommission)
            : "Sin asignar"}
        </span>

        <button
          onClick={() => setEditingCommission(true)}
          className="text-xs text-blue-600 hover:underline"
        >
          Editar
        </button>
      </div>
    );
  };

  const statusSteps = [
    "PENDING",
    "SENT_TO_SUPPLIER",
    "CONFIRMED_BY_SUPPLIER",
    "SHIPPED",
    "IN_TRANSIT",
    "DELIVERED",
  ];

  const nextStatusMap: Record<string, string | null> = {
    PENDING: "SENT_TO_SUPPLIER",
    SENT_TO_SUPPLIER: "CONFIRMED_BY_SUPPLIER",
    CONFIRMED_BY_SUPPLIER: "SHIPPED",
    SHIPPED: "IN_TRANSIT",
    IN_TRANSIT: "DELIVERED",
    DELIVERED: null,
  };

  const nextStatus = nextStatusMap[order.status];

  const handleAdvanceStatus = () => {
    if (!nextStatus) return;

    console.log("Cambiar estado a:", nextStatus);
    mutation.mutate();

    // Aquí luego irá mutation.mutate(...)
  };

  const currentIndex = statusSteps.indexOf(order.status);

  const isFinalErrorState = ["CANCELLED", "REJECTED", "RETURNED"].includes(
    order.status,
  );

  const tabs = [
    { key: "info", label: "Información" },

    { key: "finance", label: "Finanzas" },
  ];

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ===================== */}
        {/* HEADER */}
        {/* ===================== */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200/70">
          <div className="p-6 flex justify-between items-center">
            <div>
              <div className="text-xs text-zinc-500 uppercase tracking-wide">
                Detalle de orden
              </div>
              <h1 className="text-2xl font-semibold text-zinc-900">
                Orden #{order.id}
              </h1>

              <div className="mt-3">
                <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                  {statusMap[order.status] ?? order.status}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push("/dashboard/orders")}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition"
              >
                Volver
              </button>

              <button
                onClick={() => setEditOrder(order)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition"
              >
                Editar
              </button>
            </div>
          </div>
        </div>

        {/* ===================== */}
        {/* TIMELINE */}
        {/* ===================== */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200/70 p-8">
          <h2 className="text-sm font-semibold text-zinc-900 mb-8">
            Estado de la orden
          </h2>

          {isFinalErrorState ? (
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-full bg-red-600" />
              <span className="font-medium text-red-600">
                {statusMap[order.status]}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              {statusSteps.map((step, index) => {
                const isCompleted = index < currentIndex;
                const isCurrent = index === currentIndex;

                return (
                  <div
                    key={step}
                    className="flex-1 flex flex-col items-center relative"
                  >
                    {index !== statusSteps.length - 1 && (
                      <div className="absolute top-2 left-1/2 w-full h-0.5 bg-zinc-200" />
                    )}

                    <div
                      className={[
                        "h-4 w-4 rounded-full z-10",
                        isCompleted
                          ? "bg-emerald-500"
                          : isCurrent
                            ? "bg-blue-600"
                            : "bg-zinc-300",
                      ].join(" ")}
                    />

                    <span
                      className={[
                        "mt-3 text-xs text-center max-w-[90px]",
                        isCompleted
                          ? "text-emerald-600 font-medium"
                          : isCurrent
                            ? "text-blue-600 font-medium"
                            : "text-zinc-500",
                      ].join(" ")}
                    >
                      {statusMap[step]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {!isFinalErrorState && nextStatus && (
            <div className="mt-10 flex justify-end">
              <button
                onClick={handleAdvanceStatus}
                disabled={mutation.isPending}
                className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 transition disabled:opacity-50"
              >
                {mutation.isPending
                  ? "Actualizando..."
                  : `Avanzar a: ${statusMap[nextStatus]}`}
              </button>
            </div>
          )}
        </div>

        {/* ===================== */}
        {/* TABS */}
        {/* ===================== */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200/70 overflow-hidden">
          {/* TAB NAV */}
          <div className="border-b border-zinc-200 px-8">
            <div className="flex gap-8">
              {tabs.map((tab) => {
                const isActive = currentTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    onClick={() => setTab(tab.key)}
                    className={[
                      "relative py-5 text-sm font-medium transition cursor-pointer",
                      isActive
                        ? "text-slate-900"
                        : "text-zinc-500 hover:text-zinc-800",
                    ].join(" ")}
                  >
                    {tab.label}

                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB CONTENT */}
          <div className="p-8">
            {currentTab === "info" && (
              <div className="text-sm">
                {/* Aquí va tu bloque info ya estilizado */}
                {currentTab === "info" && (
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 text-sm">
                    {/* ===================== */}
                    {/* CLIENTE */}
                    {/* ===================== */}
                    <div className="bg-white border rounded-xl p-6 shadow-sm space-y-6">
                      <h3 className="text-base font-semibold text-slate-800">
                        Información del cliente
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-zinc-500">Nombre</p>
                          <p className="font-medium text-slate-900">
                            {order.fullName || "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-zinc-500">Teléfono</p>
                          <p className="font-medium text-slate-900">
                            {order.phone || "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ===================== */}
                    {/* PRODUCTO */}
                    {/* ===================== */}
                    <div className="bg-white border rounded-xl p-6 shadow-sm space-y-6">
                      <h3 className="text-base font-semibold text-slate-800">
                        Producto
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-zinc-500">
                            Nombre del producto
                          </p>
                          <p className="font-medium text-slate-900">
                            {order.productName || "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-zinc-500">Cantidad</p>
                          <p className="font-medium text-slate-900">
                            {order.quantity}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ===================== */}
                    {/* RESUMEN RÁPIDO */}
                    {/* ===================== */}
                    <div className="bg-white border rounded-xl p-6 shadow-sm space-y-6">
                      <h3 className="text-base font-semibold text-slate-800">
                        Resumen rápido
                      </h3>

                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">ID Orden</span>
                          <span className="font-medium">{order.id}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-zinc-500">Fecha</span>
                          <span className="font-medium">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ===================== */}
                    {/* NOTAS */}
                    {/* ===================== */}
                    <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Notas cliente */}
                      <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
                        <h3 className="text-base font-semibold text-slate-800">
                          Notas del cliente
                        </h3>

                        <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 text-zinc-700 leading-relaxed">
                          {additionalNotes || "Sin notas del cliente"}
                        </div>
                      </div>

                      {/* Notas internas */}
                      <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
                        <h3 className="text-base font-semibold text-slate-800">
                          Notas internas
                        </h3>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-zinc-700 leading-relaxed">
                          {internalNotes || "Sin notas internas"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentTab === "finance" && (
              <div className="text-sm">
                {/* Aquí va tu bloque finance/logística integrado */}
                {currentTab === "finance" && (
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 text-sm">
                    {/* ===================== */}
                    {/* LOGÍSTICA */}
                    {/* ===================== */}
                    <div className="space-y-6 bg-white border rounded-xl p-6 shadow-sm">
                      <h3 className="text-base font-semibold text-slate-800">
                        Logística
                      </h3>

                      {/* Transportadora */}
                      <div className="space-y-2">
                        <p className="text-xs text-zinc-500">Transportadora</p>

                        {editingCarrier ? (
                          <div className="flex gap-2 items-center">
                            <select
                              value={carrierValue}
                              onChange={(e) =>
                                setCarrierValue(e.target.value as any)
                              }
                              className="border rounded-lg px-3 py-2 text-sm"
                            >
                              <option value="INTERRAPIDISIMO">
                                Interrapidísimo
                              </option>
                              <option value="COORDINADORA">Coordinadora</option>
                              <option value="GIBOR">Gibor</option>
                            </select>

                            <button
                              onClick={() =>
                                updateMutation.mutate({ carrier: carrierValue })
                              }
                              className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs"
                            >
                              Guardar
                            </button>

                            <button
                              onClick={() => setEditingCarrier(false)}
                              className="text-xs text-zinc-500"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{carrierLabel}</span>

                            <button
                              onClick={() => setEditingCarrier(true)}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Editar
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Comisión contra entrega */}
                      <div className="space-y-2">
                        <p className="text-xs text-zinc-500">
                          Comisión contra entrega
                        </p>

                        {editingCommission ? (
                          <div className="flex gap-2 items-center">
                            <input
                              type="number"
                              value={commissionValue}
                              onChange={(e) =>
                                setCommissionValue(Number(e.target.value))
                              }
                              className="border rounded-lg px-3 py-2 text-sm w-28"
                            />

                            <button
                              onClick={() =>
                                updateMutation.mutate({
                                  carrierCommission: commissionValue,
                                })
                              }
                              className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs"
                            >
                              Guardar
                            </button>

                            <button
                              onClick={() => setEditingCommission(false)}
                              className="text-xs text-zinc-500"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
                            <span className="font-medium">
                              {order.carrierCommission
                                ? money(order.carrierCommission)
                                : "Sin asignar"}
                            </span>

                            <button
                              onClick={() => setEditingCommission(true)}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Editar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ===================== */}
                    {/* ESTADOS DE PAGO */}
                    {/* ===================== */}
                    <div className="space-y-6 bg-white border rounded-xl p-6 shadow-sm">
                      <h3 className="text-base font-semibold text-slate-800">
                        Estados de pago
                      </h3>

                      {/* Pago proveedor */}
                      <div className="space-y-2">
                        <p className="text-xs text-zinc-500">Pago proveedor</p>

                        {editingSupplierPayment ? (
                          <div className="flex gap-2 items-center">
                            <select
                              value={supplierPaymentValue}
                              onChange={(e) =>
                                setSupplierPaymentValue(e.target.value as any)
                              }
                              className="border rounded-lg px-3 py-2 text-sm"
                            >
                              <option value="NOT_PAID">No pagado</option>
                              <option value="PAID">Pagado</option>
                            </select>

                            <button
                              onClick={() =>
                                updateMutation.mutate({
                                  supplierPaymentStatus: supplierPaymentValue,
                                })
                              }
                              className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs"
                            >
                              Guardar
                            </button>

                            <button
                              onClick={() => setEditingSupplierPayment(false)}
                              className="text-xs text-zinc-500"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                order.supplierPaymentStatus === "PAID"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {supplierPaymentLabel(
                                order.supplierPaymentStatus,
                              )}
                            </span>

                            <button
                              onClick={() => setEditingSupplierPayment(true)}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Editar
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Pago cliente */}
                      <div className="space-y-2">
                        <p className="text-xs text-zinc-500">Pago cliente</p>

                        {editingCustomerPayment ? (
                          <div className="flex gap-2 items-center">
                            <select
                              value={customerPaymentValue}
                              onChange={(e) =>
                                setCustomerPaymentValue(e.target.value as any)
                              }
                              className="border rounded-lg px-3 py-2 text-sm"
                            >
                              <option value="PENDING">Pendiente</option>
                              <option value="PAID">Pagado</option>
                              <option value="NOT_PAID">No pagado</option>
                            </select>

                            <button
                              onClick={() =>
                                updateMutation.mutate({
                                  customerPaymentStatus: customerPaymentValue,
                                })
                              }
                              className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs"
                            >
                              Guardar
                            </button>

                            <button
                              onClick={() => setEditingCustomerPayment(false)}
                              className="text-xs text-zinc-500"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                order.customerPaymentStatus === "PAID"
                                  ? "bg-green-100 text-green-700"
                                  : order.customerPaymentStatus === "PENDING"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {customerPaymentLabel(
                                order.customerPaymentStatus,
                              )}
                            </span>

                            <button
                              onClick={() => setEditingCustomerPayment(true)}
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Editar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ===================== */}
                    {/* RESUMEN FINANCIERO */}
                    {/* ===================== */}
                    <div className="space-y-6 bg-white border rounded-xl p-6 shadow-sm">
                      <h3 className="text-base font-semibold text-slate-800">
                        Resumen financiero
                      </h3>

                      <div className="flex justify-between">
                        <span className="text-zinc-500">Precio venta</span>
                        <span className="font-medium">
                          {order.unitSalePrice
                            ? money(order.unitSalePrice)
                            : "Sin asignar"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-zinc-500">Costo proveedor</span>
                        <span className="font-medium">
                          {money(order.supplierBaseCost)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-zinc-500">
                          Comisión transportadora
                        </span>
                        <span className="font-medium">
                          {order.carrierCommission
                            ? money(order.carrierCommission)
                            : "-"}
                        </span>
                      </div>

                      <div className="flex justify-between border-t pt-4">
                        <span className="font-semibold">Utilidad</span>
                        <span
                          className={`font-semibold ${
                            order.profit && order.profit < 0
                              ? "text-red-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {order.profit ? money(order.profit) : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
