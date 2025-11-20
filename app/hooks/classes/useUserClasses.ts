"use client";

import { classProvider } from "@/app/functions/ClassProvider";
import { ClassOverviewResponse } from "@/app/interface/classes/responses/IClassOverviewResponse";
import { FilterClassFormInputs } from "@/app/schemas/classes/filterClass";
import { useQuery } from "@tanstack/react-query";

export const useUserClasses = (values?: FilterClassFormInputs) => {
  return useQuery({
    queryKey: ["user-classes", values],
    queryFn: async () => {
      const res = await classProvider.getUserClasses(values);

      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: ClassOverviewResponse[]) =>
      data.map((c, idx) => ({
        key: c.id ?? idx,
        ...c,
      })),
  });
};
