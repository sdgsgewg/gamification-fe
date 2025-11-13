"use client";

import { classTaskProvider } from "@/app/functions/ClassTaskProvider";
import { FilterClassTask } from "@/app/interface/class-tasks/requests/IFilterClassTaskRequest";
import { ClassTaskResponse } from "@/app/interface/class-tasks/responses/IStudentClassTaskResponse";

import { useQuery } from "@tanstack/react-query";

export const useStudentClassTasks = (
  slug: string,
  values?: FilterClassTask
) => {
  return useQuery({
    queryKey: ["class-tasks", slug, values],
    enabled: !!slug,
    queryFn: async () => {
      const res = await classTaskProvider.getStudentClassTasks(slug, values);
      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat daftar tugas milik siswa di kelas");

      const tasks = res.data;

      const mapped: ClassTaskResponse[] = tasks;

      return mapped;
    },
  });
};
