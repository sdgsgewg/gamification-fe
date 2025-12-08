"use client";

import { classTaskProvider } from "@/app/functions/ClassTaskProvider";
import { FilterTaskAttemptRequest } from "@/app/interface/task-attempts/requests/IFilterTaskAttemptRequest";
import { GroupedTaskAttemptResponse } from "@/app/interface/task-attempts/responses/IGroupedTaskAttemptResponse";
import { useQuery } from "@tanstack/react-query";

export const useTasksFromAllClasses = (values?: FilterTaskAttemptRequest) => {
  return useQuery({
    queryKey: ["tasks-from-all-classes", values],
    queryFn: async () => {
      const res = await classTaskProvider.getTasksFromAllClasses(values);

      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: GroupedTaskAttemptResponse[]) =>
      data.map((gta, idx) => ({
        key: idx,
        ...gta,
      })),
  });
};
