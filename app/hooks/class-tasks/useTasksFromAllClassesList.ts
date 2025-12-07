"use client";

import { classTaskProvider } from "@/app/functions/ClassTaskProvider";
import { ClassTaskOverviewResponse } from "@/app/interface/class-tasks/responses/IClassTaskOverviewResponse";
import { FilterTaskAttemptRequest } from "@/app/interface/task-attempts/requests/IFilterTaskAttemptRequest";
import { useQuery } from "@tanstack/react-query";

export const useTasksFromAllClassesList = (
  values?: FilterTaskAttemptRequest
) => {
  return useQuery({
    queryKey: ["tasks-from-all-classes-list", values],
    queryFn: async () => {
      const res = await classTaskProvider.getTasksFromAllClassesList(values);

      console.log("Res: ", JSON.stringify(res, null, 2));

      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: ClassTaskOverviewResponse[]) =>
      data.map((ta, idx) => ({
        key: idx,
        ...ta,
      })),
  });
};
