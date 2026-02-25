"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/tables/data-table";
import { userColumns } from "@/components/tables/user-columns";
import { useUsers } from "@/hooks/useUsers";
import { User } from "@/types/user.types";
import { activateUser, deactivateUser } from "@/services/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateUserModal } from "@/components/users/create-user-modal";
import { EditUserModal } from "@/components/users/edit-user-modal";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");

  const router = useRouter();
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const [openCreate, setOpenCreate] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const limit = 10;
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useUsers(page, limit);

  const filteredItems = useMemo(() => {
    const items = data?.items ?? [];
    const query = q.trim().toLowerCase();

    return items.filter((u) => {
      const fullName = `${u.firstName ?? ""} ${u.lastName ?? ""}`.toLowerCase();
      const matchesQuery =
        !query ||
        fullName.includes(query) ||
        String(u.phone ?? "")
          .toLowerCase()
          .includes(query) ||
        String(u.email ?? "")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        status === "all" ||
        (status === "active" && u.isActive) ||
        (status === "inactive" && !u.isActive);

      return matchesQuery && matchesStatus;
    });
  }, [data?.items, q, status]);

  const toggleMutation = useMutation({
    mutationFn: async (u: User) => {
      return u.isActive ? deactivateUser(u.id) : activateUser(u.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const cols = useMemo(
    () =>
      userColumns({
        onEdit: (u) => setEditUser(u),
        onToggleActive: (u) => toggleMutation.mutate(u),
        onView: (u) => router.push(`/dashboard/users/${u.id}`),
      }),
    [toggleMutation, router],
  );

  if (isLoading) return <div className="p-6">Cargando...</div>;
  if (isError) return <div className="p-6">Error cargando usuarios</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Usuarios</h1>
          <p className="text-zinc-600 text-sm">
            Leads/clientes que llegan por WhatsApp y realizan compras.
          </p>
        </div>

        <button
          className="
          inline-flex
           items-center
            justify-center
             rounded-xl
              bg-[var(--create-button)]
            hover:bg-[var(--create-button-hover)]
             px-4
              py-2
               text-sm
                font-medium
                 text-white
                   transition shadow-sm"
          onClick={() => setOpenCreate(true)}
        >
          + Crear usuario
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200/70 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre, teléfono o email..."
          className="w-full sm:max-w-sm rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
        />

        <div className="flex items-center gap-3">
          <div className="text-sm text-zinc-600">
            <span className="font-medium text-zinc-900">
              {filteredItems.length}
            </span>{" "}
            usuarios en esta página
          </div>

          <div className="inline-flex rounded-lg ring-1 ring-zinc-200/70 bg-white p-1">
            {(["all", "active", "inactive"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setStatus(v)}
                className={[
                  "px-3 py-1.5 text-xs rounded-md font-medium transition cursor-pointer",
                  status === v
                    ? "bg-slate-900 text-white"
                    : "text-zinc-700 hover:bg-zinc-100",
                ].join(" ")}
              >
                {v === "all"
                  ? "Todos"
                  : v === "active"
                    ? "Activos"
                    : "Inactivos"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table card */}
      {data && (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-zinc-200/70 overflow-hidden">
          <div className="p-4 border-b border-zinc-100">
            <div className="text-sm font-medium text-zinc-900">Listado</div>
          </div>

          <DataTable columns={cols} data={filteredItems} />

          <div className="flex items-center justify-between p-4 border-t border-zinc-100">
            <div className="text-sm text-zinc-600">
              Página{" "}
              <span className="font-medium text-zinc-900">{data.page}</span> de{" "}
              <span className="font-medium text-zinc-900">{data.pages}</span>
            </div>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              <button
                disabled={page === data.pages}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modales */}
      <CreateUserModal open={openCreate} onOpenChange={setOpenCreate} />

      <EditUserModal
        open={!!editUser}
        user={editUser}
        onOpenChange={() => setEditUser(null)}
      />
    </div>
  );
}
