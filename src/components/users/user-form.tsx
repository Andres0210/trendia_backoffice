"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  firstName: z.string().trim().min(1, "Nombre es obligatorio"),
  lastName: z.string().trim().min(1, "Apellido es obligatorio"),
  phone: z
    .string()
    .trim()
    .min(7, "Teléfono inválido")
    .max(20, "Teléfono demasiado largo")
    .regex(/^(\+\d{7,15}|\d{7,15})$/, "Usa +573001112233 o 3001112233"),
  isActive: z.boolean().optional(),
});

export type UserFormData = z.infer<typeof schema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

type Props = {
  mode: "create" | "edit";
  defaultValues?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  isSubmitting?: boolean;
  disablePhone?: boolean; // en edit
};

export function UserForm({
  mode,
  defaultValues,
  onSubmit,
  isSubmitting,
  disablePhone,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      isActive: true,
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) reset({ ...defaultValues } as any);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-900">Nombre</label>
          <input
            {...register("firstName")}
            placeholder="Ej: Juan"
            className={[
              "w-full rounded-lg border bg-zinc-50 px-3 py-2 text-sm text-zinc-900",
              "outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-300",
              errors.firstName ? "border-red-300 bg-red-50" : "border-zinc-200",
            ].join(" ")}
          />
          <FieldError message={errors.firstName?.message} />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-900">Apellido</label>
          <input
            {...register("lastName")}
            placeholder="Ej: Pérez"
            className={[
              "w-full rounded-lg border bg-zinc-50 px-3 py-2 text-sm text-zinc-900",
              "outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-300",
              errors.lastName ? "border-red-300 bg-red-50" : "border-zinc-200",
            ].join(" ")}
          />
          <FieldError message={errors.lastName?.message} />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-900">WhatsApp</label>
        <input
          {...register("phone")}
          disabled={disablePhone}
          placeholder="Ej: +573001112233"
          className={[
            "w-full rounded-lg border px-3 py-2 text-sm text-zinc-900",
            disablePhone ? "bg-zinc-100 cursor-not-allowed" : "bg-zinc-50",
            "outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-300",
            errors.phone ? "border-red-300 bg-red-50" : "border-zinc-200",
          ].join(" ")}
        />
        <p className="text-xs text-zinc-500">
          {mode === "edit"
            ? "El teléfono no se puede cambiar."
            : "Formato recomendado: +57..."}
        </p>
        <FieldError message={errors.phone?.message} />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-zinc-900">Activo</div>
            <div className="text-xs text-zinc-500">Habilitado en gestión.</div>
          </div>
          <input
            type="checkbox"
            {...register("isActive")}
            className="h-4 w-4 accent-slate-900"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-slate-900 text-white py-2.5 text-sm font-medium hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting
          ? mode === "create"
            ? "Creando..."
            : "Guardando..."
          : mode === "create"
            ? "Crear usuario"
            : "Guardar cambios"}
      </button>
    </form>
  );
}
