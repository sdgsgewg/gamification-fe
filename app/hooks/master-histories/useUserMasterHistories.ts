"use client";

import { masterHistoryProvider } from "@/app/functions/MasterHistoryProvider";
import { MasterHistoryOverviewResponse } from "@/app/interface/master-histories/responses/IMasterHistoryOverviewResponse";
import { useQuery } from "@tanstack/react-query";

export const useUserMasterHistories = () => {
  return useQuery({
    queryKey: ["user-master-histories"],
    queryFn: async () => {
      const res = await masterHistoryProvider.getUserMasterHistories();

      console.log("Master history data: ", JSON.stringify(res, null, 2));

      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: MasterHistoryOverviewResponse[]) =>
      data.map((mh, idx) => ({
        key: idx,
        ...mh,
      })),
  });
};
