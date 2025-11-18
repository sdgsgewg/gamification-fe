"use client";

import { activityLogProvider } from "@/app/functions/ActivityLogProvider";
import { ActivityLogOverviewResponse } from "@/app/interface/activity-logs/responses/IActivityLogOverviewResponse";
import { useQuery } from "@tanstack/react-query";

export const useRecentSubmissions = () => {
  return useQuery({
    queryKey: ["recent-submissions"],
    queryFn: async () => {
      const res = await activityLogProvider.getRecentSubmissions();
      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: ActivityLogOverviewResponse[]) =>
      data.map((rs, idx) => ({
        key: idx,
        ...rs,
      })),
  });
};
