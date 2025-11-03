"use client";

import { useQuery } from "@tanstack/react-query";
import { activityProvider } from "@/app/functions/ActivityProvider";
import { ActivityWithQuestionsResponse } from "@/app/interface/activities/responses/IActivityWithQuestionsResponse";
import { getImageSrc } from "@/app/utils/image";

export const useActivityWithQuestions = (slug: string) => {
  return useQuery({
    queryKey: ["activityWithQuestions", slug],
    enabled: !!slug,
    queryFn: async () => {
      const res = await activityProvider.getActivityWithQuestions(slug);
      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat detail aktivitas");

      const act = res.data;

      const mapped: ActivityWithQuestionsResponse = {
        ...act,
        questions: act.questions.map((q) => ({
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
