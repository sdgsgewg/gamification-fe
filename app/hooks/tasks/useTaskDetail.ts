"use client";

import { useQuery } from "@tanstack/react-query";
import { ManageItemMode } from "@/app/types/ManageItemMode";
import { TaskDetailResponse } from "@/app/interface/tasks/responses/ITaskDetailResponse";
import { taskProvider } from "@/app/functions/TaskProvider";
import { getImageSrc } from "@/app/utils/image";

export const useTaskDetail = <M extends ManageItemMode>(
  slug: string,
  mode: M
) => {
  return useQuery({
    queryKey: ["taskDetail", slug],
    enabled: !!slug,
    queryFn: async () => {
      const res = await taskProvider.getTaskDetail(slug);
      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat detail tugas");

      const t = res.data;
      if (mode === "edit") {
        // Mode edit
        const mapped: TaskDetailResponse = {
          ...t,
          updatedBy: "",
          image: t.image ? getImageSrc(t.image) : "",
        };
        return mapped;
      }

      // Mode detail
      const mapped: TaskDetailResponse = {
        ...t,
        image: t.image ? getImageSrc(t.image) : "",
      };
      return mapped;
    },
  });
};
