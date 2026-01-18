"use client";

import { taskAttemptProvider } from "@/app/functions/TaskAttemptProvider";
import { ClassTaskAttemptResponse } from "@/app/interface/task-attempts/responses/student-attempt/IClassTaskAttemptResponse";
import { useQuery } from "@tanstack/react-query";

export const useTaskAttemptsFromClass = () => {
  return useQuery<ClassTaskAttemptResponse[]>({
    queryKey: ["task-attempts-from-class"],
    queryFn: async () => {
      const res = await taskAttemptProvider.getAllTaskAttemptsFromClass();
      return res.isSuccess && res.data ? res.data : [];
    },
  });
};
