"use client";

import { classTaskProvider } from "@/app/functions/ClassTaskProvider";
import { AvailableClassesResponse } from "@/app/interface/class-tasks/responses/IAvailableClassesResponse";
import { useQuery } from "@tanstack/react-query";

export const useAvailableClasses = (taskId: string, searchText?: string) => {
  return useQuery({
    queryKey: ["available-classes", taskId, searchText],
    queryFn: async () => {
      const res = await classTaskProvider.getAvailableClasses(taskId, {
        searchText,
      });

      console.log("Available classes: ", JSON.stringify(res, null, 2));

      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: AvailableClassesResponse[]) =>
      data.map((c, idx) => ({
        key: c.id ?? idx,
        ...c,
      })),
    enabled: !!taskId,
  });
};
