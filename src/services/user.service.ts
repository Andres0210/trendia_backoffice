/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/axios";
import { PaginatedResponse, User } from "@/types/user.types";

export const getUsers = async (
  page: number,
  limit: number,
  params?: {
    q?: string;
    isActive?: boolean;
    tag?: string;
    source?: string;
    city?: string;
    whatsappOptIn?: boolean;
    emailOptIn?: boolean;
  },
): Promise<PaginatedResponse<User>> => {
  const { data } = await api.get("/users", {
    params: { page, limit, ...params },
  });
  return data;
};

export const createUser = async (payload: any) => {
  const { data } = await api.post("/users", payload);
  return data as User;
};

// Update general (no phone/id)
export const updateUser = async (id: string, payload: any) => {
  const { data } = await api.patch(`/users/${id}`, payload);
  return data as User;
};

export const activateUser = async (id: string) => {
  const { data } = await api.patch(`/users/${id}/activate`);
  return data as User;
};

export const deactivateUser = async (id: string) => {
  const { data } = await api.patch(`/users/${id}/deactivate`);
  return data as User;
};

// Tags patch (add/remove)
export const patchUserTags = async (
  id: string,
  payload: { add?: string[]; remove?: string[] },
) => {
  const { data } = await api.patch(`/users/${id}/tags`, payload);
  return data as User;
};
