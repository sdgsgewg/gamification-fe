"use client";

import { taskAttemptProvider } from "@/app/functions/TaskAttemptProvider";
import { ClassTaskStudentAttemptResponse } from "@/app/interface/task-attempts/responses/student-attempt/IClassTaskStudentAttemptResponse";
import { useQuery } from "@tanstack/react-query";

export const useStudentAttemptsFromClassTask = (
  classSlug: string,
  taskSlug: string,
) => {
  return useQuery({
    queryKey: ["student-attempts-from-class-task", classSlug, taskSlug],
    queryFn: async () => {
      const res = await taskAttemptProvider.getStudentAttemptsFromClassTask(
        classSlug,
        taskSlug,
      );
      if (!res.isSuccess || !res.data)
        throw new Error(
          "Gagal memuat data percobaan tugas untuk tugas dari class.",
        );

      const data: ClassTaskStudentAttemptResponse = res.data;

      return data;
    },
  });
};
