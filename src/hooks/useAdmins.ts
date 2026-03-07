import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdmins, toggleAdmin } from "@/services/admin.service";

export function useAdmins() {
  return useQuery({
    queryKey: ["admins"],
    queryFn: getAdmins,
  });
}

export function useToggleAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleAdmin(id, isActive),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
}
