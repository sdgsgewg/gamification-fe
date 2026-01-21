"use client";

import { taskAttemptProvider } from "@/app/functions/TaskAttemptProvider";
import { FilterTaskAttemptAnalyticsRequest } from "@/app/interface/task-attempts/requests/IFilterTaskAttemptAnalyticsRequest";
import { StudentTaskAttemptAnalyticsResponse } from "@/app/interface/task-attempts/responses/attempt-analytics/IStudentTaskAttemptAnalyticsResponse";
import { useQuery } from "@tanstack/react-query";

export const useStudentTaskAttemptsAnalytics = (
  values?: FilterTaskAttemptAnalyticsRequest,
) => {
  return useQuery<StudentTaskAttemptAnalyticsResponse[]>({
    queryKey: [
      "student-task-attempts-analytics",
      values?.scope ?? "none",
      values?.searchText ?? "",
    ],
    queryFn: async () => {
      const res =
        await taskAttemptProvider.getStudentTaskAttemptsAnalytics(values);
      return res.isSuccess && res.data ? res.data : [];
    },
  });
};
