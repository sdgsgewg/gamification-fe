"use client";

import { useQuery } from "@tanstack/react-query";
import { taskAttemptProvider } from "@/app/functions/TaskAttemptProvider";
import { MostPopularTaskResponse } from "@/app/interface/task-attempts/responses/IMostPopularTaskResponse";

export const useMostPopularTask = () => {
  return useQuery({
    queryKey: ["most-popular-task"],
    queryFn: async () => {
      const res = await taskAttemptProvider.getMostPopularTask();
      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: MostPopularTaskResponse[]) =>
      data.map((mpt, idx) => ({ key: idx, ...mpt })),
  });
};
