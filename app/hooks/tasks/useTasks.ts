"use client";

import { useQuery } from "@tanstack/react-query";
import { FilterTaskFormInputs } from "@/app/schemas/tasks/filterTask";
import { taskProvider } from "@/app/functions/TaskProvider";
import { TaskOverviewResponse } from "@/app/interface/tasks/responses/ITaskOverviewResponse";

export const useTasks = (values?: FilterTaskFormInputs) => {
  return useQuery({
    queryKey: ["tasks", values],
    queryFn: async () => {
      const res = await taskProvider.getTasks(values);
      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: TaskOverviewResponse[]) =>
      data.map((t, idx) => ({
        key: t.taskId ?? idx,
        ...t,
      })),
  });
};
