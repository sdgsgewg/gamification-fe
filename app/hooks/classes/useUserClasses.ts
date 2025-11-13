"use client";

import { classProvider } from "@/app/functions/ClassProvider";
import { ClassOverviewResponse } from "@/app/interface/classes/responses/IClassOverviewResponse";
import { useQuery } from "@tanstack/react-query";

export const useUserClasses = (searchText?: string) => {
  return useQuery({
    queryKey: ["user-classes", searchText],
    queryFn: async () => {
      const res = await classProvider.getUserClasses({ searchText });

      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: ClassOverviewResponse[]) =>
      data.map((c, idx) => ({
        key: c.id ?? idx,
        ...c,
      })),
  });
};
