"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskProvider } from "@/app/functions/TaskProvider";

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => taskProvider.deleteTask(id),
    onSuccess: () => {
      // invalidate query agar data otomatis refresh
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
