"use client";

import { activityLogProvider } from "@/app/functions/ActivityLogProvider";
import { ActivityLogOverviewResponse } from "@/app/interface/activity-logs/responses/IActivityLogOverviewResponse";
import { useQuery } from "@tanstack/react-query";

export const useUserActivityLogs = () => {
  return useQuery({
    queryKey: ["user-activity-logs"],
    queryFn: async () => {
      const res = await activityLogProvider.getUserActivityLogs();

      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: ActivityLogOverviewResponse[]) =>
      data.map((al, idx) => ({
        key: idx,
        ...al,
      })),
  });
};
