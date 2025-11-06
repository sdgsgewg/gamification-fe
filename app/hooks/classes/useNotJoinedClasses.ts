"use client";

import { classProvider } from "@/app/functions/ClassProvider";
import { ClassOverviewResponse } from "@/app/interface/classes/responses/IClassOverviewResponse";
import { useQuery } from "@tanstack/react-query";

export const useNotJoinedClasses = (searchText?: string) => {
  return useQuery({
    queryKey: ["not-joined-classes", searchText],
    queryFn: async () => {
      const res = await classProvider.getNotJoinedClasses({ searchText });

      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: ClassOverviewResponse[]) =>
      data.map((c, idx) => ({
        key: c.id ?? idx,
        ...c,
      })),
  });
};
