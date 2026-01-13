"use client";

import { userProvider } from "@/app/functions/UserProvider";
import { UserRecentActivityResponse } from "@/app/interface/users/responses/IUserRecentActivityResponse";
import { useQuery } from "@tanstack/react-query";

export const useUserRecentActivities = () => {
  return useQuery({
    queryKey: ["user-recent-activities"],
    queryFn: async () => {
      const res = await userProvider.getUserRecentActivities();

      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: UserRecentActivityResponse[]) =>
      data.map((act, idx) => ({
        key: idx,
        ...act,
      })),
  });
};
