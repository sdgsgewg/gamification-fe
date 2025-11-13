"use client";

import { useQuery } from "@tanstack/react-query";

import { getImageSrc } from "@/app/utils/image";
import { taskAttemptProvider } from "@/app/functions/TaskAttemptProvider";
import { TaskAttemptDetailResponse } from "@/app/interface/task-attempts/responses/ITaskAttemptDetailResponse";

export const useTaskAttemptDetail = (id: string) => {
  return useQuery({
    queryKey: ["task-attempt-detail", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await taskAttemptProvider.getTaskAttemptDetail(id!);
      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat detail pengerjaan aktivitas");

      const ta = res.data;

      const mapped: TaskAttemptDetailResponse = {
        ...ta,
        description: ta.description ?? "",
        image: ta.image ? getImageSrc(ta.image) : "",
        questions: ta.questions.map((q) => ({
          ...q,
          image: q.image ? getImageSrc(q.image) : "",
          options: q.options?.map((opt) => ({
            ...opt,
          })),
        })),
      };

      return mapped;
    },
  });
};
