"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { User } from "@/types/user.types";
import { EditUserModal } from "@/components/users/edit-user-modal";

type Tab = "orders" | "messages";

async function getUser(id: string): Promise<User> {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

export default function UserProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [tab, setTab] = useState<Tab>("orders");
  const [editUser, setEditUser] = useState<User | null>(null);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
  });

  const fullName = useMemo(() => {
    if (!user) return "";
    return (
      `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Sin nombre"
    );
  }, [user]);

  if (isLoading) return <div className="p-6">Cargando...</div>;
  if (isError || !user)
    return <div className="p-6">Error cargando usuario</div>;

  return (
    <div className="space-y-6">
      {/* Top card */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200/70 overflow-hidden">
        <div className="p-5 border-b border-zinc-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs text-zinc-500">Perfil de usuario</div>
            <h1 className="text-2xl font-semibold text-zinc-900">{fullName}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
              <span className="font-medium text-zinc-900 tabular-nums">
                {user.phone}
              </span>
              <span className="text-zinc-300">•</span>
              <span
                className={[
                  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                  user.isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-zinc-200 text-zinc-600",
                ].join(" ")}
              >
                {user.isActive ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push("/dashboard/users")}
              className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition"
            >
              Volver
            </button>

            <button
              onClick={() => setEditUser(user)}
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 transition"
            >
              Editar
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-4">
          <div className="inline-flex rounded-lg ring-1 ring-zinc-200/70 bg-white p-1">
            <button
              onClick={() => setTab("orders")}
              className={[
                "px-3 py-1.5 text-xs rounded-md font-medium transition cursor-pointer",
                tab === "orders"
                  ? "bg-slate-900 text-white"
                  : "text-zinc-700 hover:bg-zinc-100",
              ].join(" ")}
            >
              Órdenes
            </button>
            <button
              onClick={() => setTab("messages")}
              className={[
                "px-3 py-1.5 text-xs rounded-md font-medium transition cursor-pointer",
                tab === "messages"
                  ? "bg-slate-900 text-white"
                  : "text-zinc-700 hover:bg-zinc-100",
              ].join(" ")}
            >
              Mensajes
            </button>
          </div>

          {/* Content */}
          <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            {tab === "orders" ? (
              <div className="text-sm text-zinc-700">
                <div className="font-medium text-zinc-900">Órdenes</div>
                <div className="mt-1 text-zinc-600">
                  Aquí listaremos las órdenes del usuario. (Siguiente paso:
                  conectar endpoint)
                </div>
              </div>
            ) : (
              <div className="text-sm text-zinc-700">
                <div className="font-medium text-zinc-900">Mensajes</div>
                <div className="mt-1 text-zinc-600">
                  Aquí listaremos el log de mensajes. (Siguiente paso: conectar
                  endpoint)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal edit */}
      <EditUserModal
        open={!!editUser}
        user={editUser}
        onOpenChange={() => setEditUser(null)}
      />
    </div>
  );
}
