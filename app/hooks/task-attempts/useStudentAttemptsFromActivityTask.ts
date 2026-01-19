"use client";

import { taskAttemptProvider } from "@/app/functions/TaskAttemptProvider";
import { ActivityTaskStudentAttemptResponse } from "@/app/interface/task-attempts/responses/attempt-analytics/IActivityTaskStudentAttemptResponse";
import { useQuery } from "@tanstack/react-query";

export const useStudentAttemptsFromActivityTask = (taskSlug: string) => {
  return useQuery({
    queryKey: ["student-attempts-from-activity-task", taskSlug],
    queryFn: async () => {
      const res =
        await taskAttemptProvider.getStudentAttemptsFromActivityTask(taskSlug);
      if (!res.isSuccess || !res.data)
        throw new Error(
          "Gagal memuat data percobaan tugas untuk tugas dari halaman activity.",
        );

      const data: ActivityTaskStudentAttemptResponse = res.data;

      return data;
    },
    enabled: Boolean(taskSlug),
  });
};
