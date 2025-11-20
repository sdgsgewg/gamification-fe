"use client";

import { classTaskProvider } from "@/app/functions/ClassTaskProvider";
import { FilterTaskAttemptRequest } from "@/app/interface/task-attempts/requests/IFilterTaskAttemptRequest";
import { TaskAttemptOverviewResponse } from "@/app/interface/task-attempts/responses/ITaskAttemptOverviewResponse";
import { useQuery } from "@tanstack/react-query";

export const useTasksFromAllClassesList = (
  values?: FilterTaskAttemptRequest
) => {
  return useQuery({
    queryKey: ["tasks-from-all-classes-list", values],
    queryFn: async () => {
      const res = await classTaskProvider.getTasksFromAllClassesList(values);
      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: TaskAttemptOverviewResponse[]) =>
      data.map((ta, idx) => ({
        key: idx,
        ...ta,
      })),
  });
};
