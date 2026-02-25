"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/user.service";
import { PaginatedResponse, User } from "@/types/user.types";

export const useUsers = (
  page: number,
  limit: number,
  params?: {
    q?: string;
    isActive?: boolean;
  },
) => {
  return useQuery<PaginatedResponse<User>>({
    queryKey: ["users", page, limit, params],
    queryFn: () => getUsers(page, limit, params),
    placeholderData: keepPreviousData,
  });
};
