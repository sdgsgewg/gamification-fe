"use client";
import { taskTypeProvider } from "@/app/functions/TaskTypeProvider";
import { TaskTypeOverviewResponse } from "@/app/interface/task-types/responses/ITaskTypeOverviewResponse";
import { FilterTaskTypeFormInputs } from "@/app/schemas/task-types/filterTaskType";
import { useQuery } from "@tanstack/react-query";

export const useTaskTypes = (values?: FilterTaskTypeFormInputs) => {
  return useQuery({
    queryKey: ["taskTypes", values],
    queryFn: async () => {
      const res = await taskTypeProvider.getTaskTypes(values);
      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: TaskTypeOverviewResponse[]) =>
      data.map((tt, idx) => ({
        key: tt.taskTypeId ?? idx,
        ...tt,
      })),
  });
};
