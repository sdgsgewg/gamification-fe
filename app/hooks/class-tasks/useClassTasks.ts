"use client";

import { classProvider } from "@/app/functions/ClassProvider";
import { FilterClassTask } from "@/app/interface/class-tasks/requests/IFilterClassTaskRequest";
import { ClassTaskResponse } from "@/app/interface/class-tasks/responses/IClassTaskResponse";

import { useQuery } from "@tanstack/react-query";

export const useClassTasks = (slug: string, values?: FilterClassTask) => {
  return useQuery({
    queryKey: ["class-tasks", slug, values],
    enabled: !!slug,
    queryFn: async () => {
      const res = await classProvider.getClassTasks(slug, values);
      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat daftar tugas di kelas");

      const tasks = res.data;

      const mapped: ClassTaskResponse[] = tasks;

      return mapped;
    },
  });
};
