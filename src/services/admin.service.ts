import { api } from "@/lib/axios";

export async function createAdmin(payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  whatsappNumber?: string;
  imageUrl?: string;
}) {
  const { data } = await api.post("/admins", payload);
  return data;
}

export async function getAdmins() {
  const { data } = await api.get("/admins");
  return data;
}

export async function toggleAdmin(id: string, isActive: boolean) {
  const { data } = await api.patch(`/admins/${id}/status`, {
    isActive,
  });
  console.log("toggleAdmin response", data);
  return data;
}
