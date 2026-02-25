import { getOrders } from "@/services/order.service";
import { Order } from "@/types/order.types";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

interface PaginatedOrders {
  data: Order[];
  page: number;
  lastPage: number;
}

export function useOrders(page: number, limit: number) {
  return useQuery<PaginatedOrders>({
    queryKey: ["orders", page, limit],
    queryFn: () => getOrders(page, limit),
    placeholderData: keepPreviousData,
  });
}
