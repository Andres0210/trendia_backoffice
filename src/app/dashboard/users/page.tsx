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
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const [openCreate, setOpenCreate] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const router = useRouter();
  const queryClient = useQueryClient();
  const limit = 10;

  const { data, isLoading, isError } = useUsers(page, limit);

  const filteredItems = useMemo(() => {
    const items = data?.items ?? [];
    const query = q.trim().toLowerCase();

    return items.filter((u) => {
      const fullName =
        `${u.firstName ?? ""} ${u.lastName ?? ""}`.toLowerCase();

      const matchesQuery =
        !query ||
        fullName.includes(query) ||
        String(u.phone ?? "").toLowerCase().includes(query) ||
        String(u.email ?? "").toLowerCase().includes(query);

      const matchesStatus =
        status === "all" ||
        (status === "active" && u.isActive) ||
        (status === "inactive" && !u.isActive);

      return matchesQuery && matchesStatus;
    });
  }, [data?.items, q, status]);

  const toggleMutation = useMutation({
    mutationFn: async (u: User) =>
      u.isActive ? deactivateUser(u.id) : activateUser(u.id),
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

  if (isLoading)
    return <div className="p-6 text-muted-foreground">Cargando...</div>;

  if (isError)
    return (
      <div className="p-6 text-destructive">
        Error cargando usuarios
      </div>
    );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Usuarios
          </h1>
          <p className="text-sm text-muted-foreground">
            Leads/clientes que llegan por WhatsApp y realizan compras.
          </p>
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          className="
            inline-flex items-center justify-center
            rounded-xl
            bg-primary
            px-4 py-2
            text-sm font-medium
            text-primary-foreground
            shadow-sm
            transition hover:bg-primary/90
          "
        >
          + Crear usuario
        </button>
      </div>

      {/* Toolbar */}
      <div className="
        bg-card
        rounded-2xl
        border border-border
        p-4
        flex flex-col gap-4
        sm:flex-row sm:items-center sm:justify-between
      ">

        {/* Search */}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre, teléfono o email..."
          className="
            w-full sm:max-w-sm
            rounded-xl
            border border-input
            bg-background
            px-3 py-2
            text-sm
            outline-none
            transition
            focus:ring-2 focus:ring-ring
          "
        />

        <div className="flex items-center gap-4 flex-wrap">

          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {filteredItems.length}
            </span>{" "}
            usuarios en esta página
          </div>

          {/* Status filter */}
          <div className="
            inline-flex
            rounded-xl
            border border-border
            bg-background
            p-1
          ">
            {(["all", "active", "inactive"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setStatus(v)}
                className={[
                  "px-3 py-1.5 text-xs rounded-lg font-medium transition",
                  status === v
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted",
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
        <div className="
          bg-card
          rounded-2xl
          border border-border
          overflow-hidden
        ">

          <div className="p-4 border-b border-border">
            <div className="text-sm font-medium text-foreground">
              Listado
            </div>
          </div>

          <DataTable columns={cols} data={filteredItems} />

          {/* Pagination */}
          <div className="
            flex items-center justify-between
            p-4 border-t border-border
          ">
            <div className="text-sm text-muted-foreground">
              Página{" "}
              <span className="font-medium text-foreground">
                {data.page}
              </span>{" "}
              de{" "}
              <span className="font-medium text-foreground">
                {data.pages}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="
                  inline-flex items-center justify-center
                  rounded-xl
                  border border-border
                  bg-background
                  px-3 py-2
                  text-sm font-medium
                  text-foreground
                  transition
                  hover:bg-muted
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                Anterior
              </button>

              <button
                disabled={page === data.pages}
                onClick={() => setPage((p) => p + 1)}
                className="
                  inline-flex items-center justify-center
                  rounded-xl
                  border border-border
                  bg-background
                  px-3 py-2
                  text-sm font-medium
                  text-foreground
                  transition
                  hover:bg-muted
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modales */}
      <CreateUserModal
        open={openCreate}
        onOpenChange={setOpenCreate}
      />

      <EditUserModal
        open={!!editUser}
        user={editUser}
        onOpenChange={() => setEditUser(null)}
      />
    </div>
  );
}