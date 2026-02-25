/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/axios";
import { Order } from "@/types/order.types";

export async function getOrders(page: number, limit: number) {
  const { data } = await api.get(`/order?page=${page}&limit=${limit}`);
  return data;
}

export async function getOrderById(id: string) {
  const { data } = await api.get(`/order/${id}`);
  return data;
}

export async function createOrder(payload: any) {
  const { data } = await api.post("/order", payload);
  return data;
}

export async function deleteOrder(id: string) {
  const { data } = await api.delete(`/order/${id}`);
  return data;
}

export async function assignOrderPrice(
  id: string,
  payload: { unitSalePrice: number; discountReason?: string },
) {
  const { data } = await api.patch(`/order/${id}/assign-price`, payload);
  return data;
}

export async function advanceOrderStatus(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/order/${id}/status`,
    {
      method: "PATCH",
    },
  );

  if (!res.ok) {
    throw new Error("Error updating status");
  }

  return res.json();
}

export async function updateOrderAdminFields(
  id: string,
  payload: {
    supplierPaymentStatus?: string;
    customerPaymentStatus?: string;
    carrierCommission?: number;
  },
) {
  const { data } = await api.patch(`/order/${id}/admin-update`, payload);

  return data;
}
