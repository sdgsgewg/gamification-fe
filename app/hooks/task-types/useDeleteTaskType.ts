"use client";

import { taskTypeProvider } from "@/app/functions/TaskTypeProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteTaskType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => taskTypeProvider.deleteTaskType(id),
    onSuccess: () => {
      // invalidate query agar data otomatis refresh
      queryClient.invalidateQueries({ queryKey: ["taskTypes"] });
    },
  });
};
