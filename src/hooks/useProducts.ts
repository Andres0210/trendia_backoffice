"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getProducts } from "@/services/product.service";
import { PaginatedResponse, Product } from "@/types/product.types";

export const useProducts = (
  page: number,
  limit: number,
  q?: string,
  isActive?: boolean,
  isOnSale?: boolean,
) => {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: ["products", page, limit, q, isActive, isOnSale],
    queryFn: () => getProducts(page, limit, q, isActive, isOnSale),
    placeholderData: keepPreviousData,
  });
};
