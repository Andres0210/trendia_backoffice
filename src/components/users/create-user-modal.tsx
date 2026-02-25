"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/services/user.service";
import { UserForm, UserFormData } from "./user-form";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export function CreateUserModal({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onOpenChange(false);
    },
  });

  const onSubmit = (data: UserFormData) => {
    mutation.mutate({
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phone: data.phone.trim(),
      isActive: data.isActive ?? true,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => onOpenChange(false)}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-zinc-200/70 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Crear usuario
              </h2>
              <p className="text-sm text-zinc-600">
                Registra un cliente/lead por WhatsApp.
              </p>
            </div>

            <button
              onClick={() => onOpenChange(false)}
              className="h-9 w-9 rounded-lg hover:bg-zinc-100 grid place-items-center transition cursor-pointer"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          <div className="p-5">
            <UserForm
              mode="create"
              onSubmit={onSubmit}
              isSubmitting={mutation.isPending}
            />

            {mutation.isError && (
              <p className="mt-3 text-sm text-red-600">
                Error creando usuario. Revisa si el teléfono o email ya existe.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
