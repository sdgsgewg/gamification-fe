"use client";

import { taskSubmissionProvider } from "@/app/functions/TaskSubmissionProvider";
import { ClassTaskAttemptAnalyticsResponse } from "@/app/interface/task-submissions/responses/IClassTaskAttemptAnalyticsResponse";
// import { FilterTaskSubmissionRequest } from "@/app/interface/task-submissions/requests/IFilterTaskSubmissionRequest";
// import { GroupedTaskSubmissionResponseDto } from "@/app/interface/task-submissions/responses/IGroupedTaskSubmissionResponse";
import { useQuery } from "@tanstack/react-query";

// export const useTaskSubmissionsInClass = (
//   classSlug: string,
//   taskSlug: string,
//   values?: FilterTaskSubmissionRequest
// ) => {
//   return useQuery({
//     queryKey: ["task-submissions-in-class", classSlug, taskSlug, values],
//     queryFn: async () => {
//       const res = await taskSubmissionProvider.getTaskSubmissionsInClass(
//         classSlug,
//         taskSlug,
//         values
//       );

//       return res.isSuccess && res.data ? res.data : [];
//     },
//     select: (data: GroupedTaskSubmissionResponseDto[]) =>
//       data.map((gta, idx) => ({
//         key: idx,
//         ...gta,
//       })),
//   });
// };

export const useTaskSubmissionsInClass = (
  classSlug: string,
  taskSlug: string,
) => {
  return useQuery({
    queryKey: ["task-submissions-in-class", classSlug, taskSlug],
    queryFn: async () => {
      const res = await taskSubmissionProvider.getTaskSubmissionsInClass(
        classSlug,
        taskSlug,
      );
      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat detail pengumpulan tugas di kelas");

      const data: ClassTaskAttemptAnalyticsResponse = res.data;

      return data;
    },
  });
};
