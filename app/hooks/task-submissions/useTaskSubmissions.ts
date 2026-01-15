"use client";

import { taskSubmissionProvider } from "@/app/functions/TaskSubmissionProvider";
// import { FilterTaskSubmissionRequest } from "@/app/interface/task-submissions/requests/IFilterTaskSubmissionRequest";
// import { GroupedTaskSubmissionResponseDto } from "@/app/interface/task-submissions/responses/IGroupedTaskSubmissionResponse";
import { TeacherClassTaskAnalyticsDto } from "@/app/interface/task-submissions/responses/ITeacherClassTaskAnalyticsResponse";
import { useQuery } from "@tanstack/react-query";

// export const useTaskSubmissions = (
//   values?: FilterTaskSubmissionRequest
// ) => {
//   return useQuery({
//     queryKey: ["task-submissions", values],
//     queryFn: async () => {
//       const res = await taskSubmissionProvider.getAllTaskSubmissions(values);

//       return res.isSuccess && res.data ? res.data : [];
//     },
//     select: (data: GroupedTaskSubmissionResponseDto[]) =>
//       data.map((gta, idx) => ({
//         key: idx,
//         ...gta,
//       })),
//   });
// };

export const useTaskSubmissions = () => {
  return useQuery({
    queryKey: ["task-submissions"],
    queryFn: async () => {
      const res = await taskSubmissionProvider.getAllTaskSubmissions();

      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: TeacherClassTaskAnalyticsDto[]) =>
      data.map((gta, idx) => ({
        key: idx,
        ...gta,
      })),
  });
};
