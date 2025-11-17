"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskProvider } from "@/app/functions/TaskProvider";

export const useUnpublishTask = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => taskProvider.unpublishTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-detail", slug] });
    },
  });
};
