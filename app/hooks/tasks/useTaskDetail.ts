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
    queryKey: ["task-detail", slug],
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
          taskDetail: {
            ...t.taskDetail,
            image: t.taskDetail.image ? getImageSrc(t.taskDetail.image) : "",
          },
        };
        return mapped;
      }

      // Mode detail
      const mapped: TaskDetailResponse = {
        ...t,
        taskDetail: {
          ...t.taskDetail,
          image: t.taskDetail.image ? getImageSrc(t.taskDetail.image) : "",
        },
      };
      return mapped;
    },
  });
};
