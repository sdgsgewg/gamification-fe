"use client";

import { useQuery } from "@tanstack/react-query";
import { getImageSrc } from "@/app/utils/image";
import { taskSubmissionProvider } from "@/app/functions/TaskSubmissionProvider";
import { TaskSubmissionWithAnswersResponse } from "@/app/interface/task-submissions/responses/TaskSubmissionWithAnswersResponse";

export const useTaskSubmissionWithAnswers = (id: string) => {
  return useQuery({
    queryKey: ["task-submission-with-answers", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await taskSubmissionProvider.getTaskSubmissionWithAnswers(
        id!
      );
      if (!res.isSuccess || !res.data)
        throw new Error(
          "Gagal memuat detail pengumpulan tugas beserta daftar jawaban"
        );

      const ts = res.data;

      const mapped: TaskSubmissionWithAnswersResponse = {
        ...ts,
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
