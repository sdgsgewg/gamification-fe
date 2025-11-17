"use client";

import { taskAttemptProvider } from "@/app/functions/TaskAttemptProvider";
import { FilterTaskAttemptRequest } from "@/app/interface/task-attempts/requests/IFilterTaskAttemptRequest";
import { GroupedTaskAttemptResponseDto } from "@/app/interface/task-attempts/responses/IGroupedTaskAttemptResponse";
import { useQuery } from "@tanstack/react-query";

export const useTaskAttemptsByUser = (values?: FilterTaskAttemptRequest) => {
  const queryValues = values ?? {}; // default empty object

  return useQuery({
    queryKey: ["task-attempts-by-user", JSON.stringify(queryValues)],
    queryFn: async () => {
      const res = await taskAttemptProvider.getTaskAttemptsByUser(queryValues);

      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: GroupedTaskAttemptResponseDto[]) =>
      data.map((gta, idx) => ({ key: idx, ...gta })),
  });
};
