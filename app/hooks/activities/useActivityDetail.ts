"use client";

import { useQuery } from "@tanstack/react-query";
import { activityProvider } from "@/app/functions/ActivityProvider";
import { ActivityDetailResponse } from "@/app/interface/activities/responses/IActivityDetailResponse";
import { getImageSrc } from "@/app/utils/image";

export const useActivityDetail = (slug: string) => {
  return useQuery({
    queryKey: ["activityDetail", slug],
    enabled: !!slug,
    queryFn: async () => {
      const res = await activityProvider.getActivityDetail(slug);
      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat detail aktivitas");

      const act = res.data;

      const mapped: ActivityDetailResponse = {
        ...act,
        image: act.image ? getImageSrc(act.image) : "",
      };
      return mapped;
    },
  });
};
