"use client";

import { useCreateAdmin } from "@/hooks/useCreateAdmin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),

  role: z
    .string()
    .min(1, "El rol es obligatorio")
    .refine((val) => ["ADMIN", "SUPER_ADMIN"].includes(val), {
      message: "Rol inválido",
    }),

  whatsappNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^57\d{10}$/.test(val),
      "Debe tener formato 573XXXXXXXXX",
    ),

  imageUrl: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function CreateAdminDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { mutate, isPending } = useCreateAdmin();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Crear administrador</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <input
              placeholder="Nombre"
              {...register("firstName")}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
            {errors.firstName && (
              <p className="text-xs text-destructive mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <input
              placeholder="Apellido"
              {...register("lastName")}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
            {errors.lastName && (
              <p className="text-xs text-destructive mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <input
              placeholder="Email"
              {...register("email")}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password inicial"
              {...register("password")}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
            {errors.password && (
              <p className="text-xs text-destructive mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="SUPER_ADMIN">SUPER_ADMIN</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.role && (
              <p className="text-xs text-destructive mt-1">
                {errors.role.message}
              </p>
            )}
          </div>

          <div>
            <input
              placeholder="WhatsApp (573XXXXXXXXX)"
              {...register("whatsappNumber")}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
            {errors.whatsappNumber && (
              <p className="text-xs text-destructive mt-1">
                {errors.whatsappNumber.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl border"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground"
            >
              {isPending ? "Creando..." : "Crear administrador"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
