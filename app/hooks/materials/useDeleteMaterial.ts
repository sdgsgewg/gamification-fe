"use client";
import { materialProvider } from "@/app/functions/MaterialProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => materialProvider.deleteMaterial(id),
    onSuccess: () => {
      // invalidate query agar data otomatis refresh
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
  });
};
