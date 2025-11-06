"use client";

import { useQuery } from "@tanstack/react-query";

import { getImageSrc } from "@/app/utils/image";
import { classTaskProvider } from "@/app/functions/ClassTaskProvider";
import { ClassTaskDetailResponseDto } from "@/app/interface/class-tasks/responses/IClassTaskDetailResponse";

export const useClassTaskDetail = (classSlug: string, taskSlug: string) => {
  return useQuery({
    queryKey: ["class-task-detail", classSlug, taskSlug],
    queryFn: async () => {
      const res = await classTaskProvider.getClassTaskDetail(
        classSlug,
        taskSlug
      );
      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat detail tugas");

      const ct = res.data;

      const mapped: ClassTaskDetailResponseDto = {
        ...ct,
        image: ct.image ? getImageSrc(ct.image) : "",
      };
      return mapped;
    },
  });
};
