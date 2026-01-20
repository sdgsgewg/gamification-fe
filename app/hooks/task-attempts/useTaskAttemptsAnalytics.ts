"use client";

import { taskAttemptProvider } from "@/app/functions/TaskAttemptProvider";
import { FilterTaskAttemptAnalyticsRequest } from "@/app/interface/task-attempts/requests/IFilterTaskAttemptAnalyticsRequest";
import { TaskAttemptAnalyticsResponse } from "@/app/interface/task-attempts/responses/attempt-analytics/ITaskAttemptAnalyticsResponse";
import { useQuery } from "@tanstack/react-query";

export const useTaskAttemptsAnalytics = (
  values?: FilterTaskAttemptAnalyticsRequest,
) => {
  return useQuery<TaskAttemptAnalyticsResponse[]>({
    queryKey: [
      "task-attempts-analytics",
      values?.scope ?? "none",
      values?.searchText ?? "",
    ],
    queryFn: async () => {
      console.log("Fetching task attempts analytics with values:", values);
      const res = await taskAttemptProvider.getAllTaskAttemptsAnalytics(values);
      return res.isSuccess && res.data ? res.data : [];
    },
  });
};
