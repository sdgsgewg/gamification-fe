"use client";

import { taskAttemptProvider } from "@/app/functions/TaskAttemptProvider";
import { FilterTaskAttemptAnalyticsRequest } from "@/app/interface/task-attempts/requests/IFilterTaskAttemptAnalyticsRequest";
import { StudentTaskAttemptDetailAnalyticsResponse } from "@/app/interface/task-attempts/responses/attempt-analytics/IStudentTaskAttemptDetailAnalyticsResponse";
import { useQuery } from "@tanstack/react-query";

export const useStudentTaskAttemptDetailAnalytics = (
  taskSlug: string,
  classSlug?: string,
  values?: FilterTaskAttemptAnalyticsRequest,
) => {
  return useQuery({
    queryKey: [
      "student-task-attempt-detail-analytics",
      classSlug,
      taskSlug,
      values,
    ],
    enabled: !!taskSlug,
    queryFn: async () => {
      const res =
        await taskAttemptProvider.getStudentTaskAttemptDetailAnalytics(
          taskSlug,
          classSlug,
          values,
        );

      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat detail data percobaan tugas.");

      const data: StudentTaskAttemptDetailAnalyticsResponse = res.data;

      return data;
    },
  });
};
