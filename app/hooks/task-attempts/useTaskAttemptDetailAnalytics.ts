"use client";

import { taskAttemptProvider } from "@/app/functions/TaskAttemptProvider";
import { FilterTaskAttemptAnalyticsRequest } from "@/app/interface/task-attempts/requests/IFilterTaskAttemptAnalyticsRequest";
import { TaskAttemptDetailAnalyticsResponse } from "@/app/interface/task-attempts/responses/attempt-analytics/ITaskAttemptDetailAnalyticsResponse";
import { useQuery } from "@tanstack/react-query";

export const useTaskAttemptDetailAnalytics = (
  taskSlug: string,
  classSlug?: string,
  values?: FilterTaskAttemptAnalyticsRequest,
) => {
  return useQuery({
    queryKey: ["student-attempts-from-class-task", classSlug, taskSlug, values],
    queryFn: async () => {
      const res = await taskAttemptProvider.getTaskAttemptDetailAnalytics(
        taskSlug,
        classSlug,
        values,
      );
      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat detail data percobaan tugas.");

      const data: TaskAttemptDetailAnalyticsResponse = res.data;

      return data;
    },
  });
};
