"use client";

import { useQuery } from "@tanstack/react-query";
import { activityProvider } from "@/app/functions/ActivityProvider";
import { ActivitySummaryResponse } from "@/app/interface/activities/responses/IActivitySummaryResponse";
import { getImageSrc } from "@/app/utils/image";

export const useActivitySummary = (attemptId: string) => {
  return useQuery({
    queryKey: ["activity-summary", attemptId],
    enabled: !!attemptId,
    queryFn: async () => {
      const res = await activityProvider.getActivitySummaryFromAttempt(
        attemptId
      );
      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat ringkasan pengerjaan aktivitas");

      const act = res.data;

      const mapped: ActivitySummaryResponse = {
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
