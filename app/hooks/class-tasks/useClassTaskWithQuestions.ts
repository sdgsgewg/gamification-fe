"use client";

import { useQuery } from "@tanstack/react-query";
import { classTaskProvider } from "@/app/functions/ClassTaskProvider";
import { ClassTaskWithQuestionsResponseDto } from "@/app/interface/class-tasks/responses/IClassTaskWithQuestionResponse";
import { getImageSrc } from "@/app/utils/image";

export const useActivityWithQuestions = (
  classSlug: string,
  taskSlug: string
) => {
  return useQuery({
    queryKey: ["class-task-with-questions", classSlug, taskSlug],
    queryFn: async () => {
      const res = await classTaskProvider.getClassTaskWithQuestions(
        classSlug,
        taskSlug
      );
      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat detail tugas");

      const ct = res.data;

      const mapped: ClassTaskWithQuestionsResponseDto = {
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
