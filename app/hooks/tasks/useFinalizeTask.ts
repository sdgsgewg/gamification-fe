"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskProvider } from "@/app/functions/TaskProvider";

export const useFinalizeTask = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => taskProvider.finalizeTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-detail", slug] });
    },
  });
};
