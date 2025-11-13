"use client";

import { useQuery } from "@tanstack/react-query";
import { activityProvider } from "@/app/functions/ActivityProvider";
import { ActivitySummaryResponse } from "@/app/interface/activities/responses/IActivitySummaryResponse";
import { getImageSrc } from "@/app/utils/image";

export const useActivitySummary = (slug: string) => {
  return useQuery({
    queryKey: ["activitySummary", slug],
    enabled: !!slug,
    queryFn: async () => {
      const res = await activityProvider.getActivitySummaryFromAttempt(slug);
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
