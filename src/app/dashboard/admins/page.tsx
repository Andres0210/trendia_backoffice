"use client";

import { CreateAdminDialog } from "@/components/admins/create-admin-dialog";
import { adminColumns } from "@/components/tables/admin-columns";
import { DataTable } from "@/components/tables/data-table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAdmins, useToggleAdmin } from "@/hooks/useAdmins";
import { useMe } from "@/hooks/useMe";
import { Admin } from "@/types/admin.types";
import { useState } from "react";

export default function AdminsPage() {
  const { data: admins = [], isLoading } = useAdmins();
  const { data: currentUser } = useMe();
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  console.log("admins", admins);

  const { mutate: toggleAdmin } = useToggleAdmin();

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Cargando administradores...
      </div>
    );
  }

  const columns = adminColumns({
    currentUserId: currentUser?.sub,
    onToggleActive: (admin: Admin) => {
      if (String(admin.id) === String(currentUser?.sub)) return;

      if (admin.isActive) {
        setSelectedAdmin(admin);
        setConfirmOpen(true);
        return;
      }

      toggleAdmin({
        id: admin.id,
        isActive: !admin.isActive,
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Lado izquierdo */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Administradores
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona los accesos al panel.
          </p>
        </div>

        {/* Lado derecho */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenCreate(true)}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            + Crear administrador
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-2">
        <DataTable columns={columns} data={admins} />
        <CreateAdminDialog open={openCreate} onOpenChange={setOpenCreate} />
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Desactivar administrador"
          description={`Estás a punto de desactivar a ${selectedAdmin?.email}. Esta acción impedirá su acceso al panel.`}
          confirmText="Desactivar"
          loading={false}
          onConfirm={() => {
            if (!selectedAdmin) return;

            toggleAdmin({
              id: selectedAdmin.id,
              isActive: false,
            });

            setConfirmOpen(false);
            setSelectedAdmin(null);
          }}
        />
      </div>
    </div>
  );
}
