"use client";

import { useQuery } from "@tanstack/react-query";
import { getImageSrc } from "@/app/utils/image";
import { taskSubmissionProvider } from "@/app/functions/TaskSubmissionProvider";
import { TaskSubmissionDetailResponse } from "@/app/interface/task-submissions/responses/ITaskSubmissionDetailResponse";

export const useTaskSubmissionDetail = (id: string) => {
  return useQuery({
    queryKey: ["task-submission-detail", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await taskSubmissionProvider.getTaskSubmissionDetail(id!);
      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat detail pengumpulan tugas");

      const ts = res.data;

      const mapped: TaskSubmissionDetailResponse = {
        ...ts,
        taskDetail: {
            ...ts.taskDetail,
            image: ts.taskDetail.image ? getImageSrc(ts.taskDetail.image) : "",
        },
        questions: ts.questions
          ? ts.questions.map((q) => ({
              ...q,
              image: q.image ? getImageSrc(q.image) : "",
              options: q.options?.map((opt) => ({
                ...opt,
              })),
            }))
          : [],
      };

      return mapped;
    },
  });
};
