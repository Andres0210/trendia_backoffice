"use client";

import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/services/user.service";
import { User } from "@/types/user.types";
import { UserForm, UserFormData } from "./user-form";

type Props = {
  open: boolean;
  user: User | null;
  onOpenChange: (v: boolean) => void;
};

export function EditUserModal({ open, user, onOpenChange }: Props) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (!open) mutation.reset();
  }, [open, mutation]);

  const onSubmit = (data: UserFormData) => {
    if (!user) return;

    mutation.mutate({
      id: user.id,
      payload: {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        isActive: data.isActive ?? true,
      },
    });
  };

  if (!open || !user) return null;

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
                Editar usuario
              </h2>
              <p className="text-sm text-zinc-600">Actualiza sus datos.</p>
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
              mode="edit"
              disablePhone
              defaultValues={{
                firstName: user.firstName ?? "",
                lastName: user.lastName ?? "",
                phone: user.phone ?? "",
                isActive: user.isActive,
              }}
              onSubmit={onSubmit}
              isSubmitting={mutation.isPending}
            />

            {mutation.isError && (
              <p className="mt-3 text-sm text-red-600">
                Error guardando cambios.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
