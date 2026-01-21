"use client";

import { useQuery } from "@tanstack/react-query";
import { taskAttemptProvider } from "@/app/functions/TaskAttemptProvider";
import { StudentAttemptDetailResponse } from "@/app/interface/task-attempts/responses/attempt-analytics/IStudentAttemptDetailResponse";
import { FilterStudentRecentAttemptRequest } from "@/app/interface/task-attempts/requests/IFilterStudentRecentAttemptRequest";

export const useStudentRecentAttempts = (
  values?: FilterStudentRecentAttemptRequest,
) => {
  return useQuery({
    queryKey: ["student-recent-attempts", values],
    queryFn: async () => {
      const res = await taskAttemptProvider.getStudentRecentAttempts(values);
      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: StudentAttemptDetailResponse[]) =>
      data.map((mpt, idx) => ({ key: idx, ...mpt })),
  });
};
