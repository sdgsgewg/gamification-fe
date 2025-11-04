"use client";

import { taskAttemptProvider } from "@/app/functions/TaskAttemptProvider";
import { FilterTaskAttemptRequest } from "@/app/interface/task-attempts/requests/IFilterTaskAttemptRequest";
import { GroupedTaskAttemptResponseDto } from "@/app/interface/task-attempts/responses/IGroupedTaskAttemptResponse";
import { useQuery } from "@tanstack/react-query";

export const useTaskAttemptsByUser = (values?: FilterTaskAttemptRequest) => {
  return useQuery({
    queryKey: ["task-attempts-by-user", values],
    queryFn: async () => {
      const res = await taskAttemptProvider.getTaskAttemptsByUser(values);

      console.log(
        "Activity grouped with date data: ",
        JSON.stringify(res, null, 2)
    );

      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: GroupedTaskAttemptResponseDto[]) =>
      data.map((gta, idx) => ({
        key: idx,
        ...gta,
      })),
  });
};
