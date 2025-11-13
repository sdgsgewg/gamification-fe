"use client";

import { useQuery } from "@tanstack/react-query";

import { taskTypeProvider } from "@/app/functions/TaskTypeProvider";
import { TaskTypeDetailResponse } from "@/app/interface/task-types/responses/ITaskTypeDetailResponse";

export const useTaskTypeById = (id: string) => {
  return useQuery({
    queryKey: ["task-type-by-id", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await taskTypeProvider.getTaskTypeById(id);
      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat detail tipe tugas");

      const tt = res.data;

      // Mode detail
      const data: TaskTypeDetailResponse = {
        taskTypeId: tt.taskTypeId,
        name: tt.name,
        slug: tt.slug,
        description: tt.description ?? "",
        scope: tt.scope,
        hasDeadline: tt.hasDeadline,
        isRepeatable: tt.isRepeatable,
        createdBy: tt.createdBy,
        updatedBy: tt.updatedBy ?? "-",
      };

      return data;
    },
  });
};
