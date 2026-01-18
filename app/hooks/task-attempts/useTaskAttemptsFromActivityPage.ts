"use client";

import { taskAttemptProvider } from "@/app/functions/TaskAttemptProvider";
import { ActivityTaskAttemptResponse } from "@/app/interface/task-attempts/responses/student-attempt/IActivityTaskAttemptResponse";
import { useQuery } from "@tanstack/react-query";

export const useTaskAttemptsFromActivityPage = () => {
  return useQuery<ActivityTaskAttemptResponse[]>({
    queryKey: ["task-attempts-from-activity-page"],
    queryFn: async () => {
      const res =
        await taskAttemptProvider.getAllTaskAttemptsFromActivityPage();
      return res.isSuccess && res.data ? res.data : [];
    },
  });
};
