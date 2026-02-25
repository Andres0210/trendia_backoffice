/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/axios";
import { PaginatedResponse, Product } from "@/types/product.types";
import axios from "axios";

export const getProducts = async (
  page: number,
  limit: number,
  q?: string,
  isActive?: boolean,
  isOnSale?: boolean,
): Promise<PaginatedResponse<Product>> => {
  const { data } = await api.get("/products", {
    params: {
      page,
      limit,
      ...(q ? { q } : {}),
      ...(typeof isActive === "boolean" ? { isActive } : {}),
      ...(typeof isOnSale === "boolean" ? { isOnSale } : {}),
    },
  });

  return data;
};

export const createProduct = async (data: any) => {
  const response = await api.post("/products", data);
  return response.data;
};

export const updateProduct = async (id: string, data: any) => {
  const res = await api.patch(`/products/${id}`, data);
  return res.data;
};

export const deactivateProduct = async (id: string) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

export const activateProduct = async (id: string) => {
  const res = await api.patch(`/products/${id}/activate`);
  return res.data;
};
