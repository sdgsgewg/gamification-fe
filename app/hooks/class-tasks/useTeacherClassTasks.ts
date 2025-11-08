"use client";

import { classTaskProvider } from "@/app/functions/ClassTaskProvider";
import { FilterClassTask } from "@/app/interface/class-tasks/requests/IFilterClassTaskRequest";
import { TeacherClassTaskResponse } from "@/app/interface/class-tasks/responses/ITeacherClassTaskResponse";
import { useQuery } from "@tanstack/react-query";

export const useTeacherClassTasks = (
  slug: string,
  values?: FilterClassTask
) => {
  return useQuery({
    queryKey: ["class-tasks", slug, values],
    enabled: !!slug,
    queryFn: async () => {
      const res = await classTaskProvider.getTeacherClassTasks(slug, values);
      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat daftar tugas milik siswa di kelas");

      const tasks = res.data;

      const mapped: TeacherClassTaskResponse[] = tasks;

      return mapped;
    },
  });
};
