"use client";

import { useQuery } from "@tanstack/react-query";
import { classTaskProvider } from "@/app/functions/ClassTaskProvider";
import { ClassTaskSummaryResponseDto } from "@/app/interface/class-tasks/responses/IClassTaskWithSummaryResponse";
import { getImageSrc } from "@/app/utils/image";

export const useClassTaskSummary = (attemptId: string) => {
  return useQuery({
    queryKey: ["class-task-summary", attemptId],
    queryFn: async () => {
      const res = await classTaskProvider.getClassTaskSummaryFromAttempt(
        attemptId
      );
      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat ringkasan pengerjaan tugas");

      const ct = res.data;

      const mapped: ClassTaskSummaryResponseDto = {
        ...ct,
        questions: ct.questions.map((q) => ({
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
