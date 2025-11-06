"use client";

import { useQuery } from "@tanstack/react-query";
import { FilterActivityFormInputs } from "@/app/schemas/activities/filterActivity";
import { activityProvider } from "@/app/functions/ActivityProvider";
import { ActivityOverviewResponse } from "@/app/interface/activities/responses/IActivityOverviewResponse";

export const useActivities = (values?: FilterActivityFormInputs) => {
  return useQuery({
    queryKey: ["activities", values],
    queryFn: async () => {
      const res = await activityProvider.getActivities(values);

      console.log("Activities: ", JSON.stringify(res, null, 2));

      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: ActivityOverviewResponse[]) =>
      data.map((act, idx) => ({
        key: act.id ?? idx,
        ...act,
      })),
  });
};
