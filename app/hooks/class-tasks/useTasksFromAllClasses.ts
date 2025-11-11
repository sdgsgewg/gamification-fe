"use client";

import { classTaskProvider } from "@/app/functions/ClassTaskProvider";
import { FilterTaskAttemptRequest } from "@/app/interface/task-attempts/requests/IFilterTaskAttemptRequest";
import { GroupedTaskAttemptResponseDto } from "@/app/interface/task-attempts/responses/IGroupedTaskAttemptResponse";
import { useQuery } from "@tanstack/react-query";

export const useTasksFromAllClasses = (values?: FilterTaskAttemptRequest) => {
  return useQuery({
    queryKey: ["tasks-from-all-classes", values],
    queryFn: async () => {
      const res = await classTaskProvider.getTasksFromAllClasses(values);

      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: GroupedTaskAttemptResponseDto[]) =>
      data.map((gta, idx) => ({
        key: idx,
        ...gta,
      })),
  });
};
