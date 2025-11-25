"use client";

import { leaderboardProvider } from "@/app/functions/LeaderboardProvider";
import { ClassLeaderboardResponse } from "@/app/interface/leaderboards/responses/IClassLeaderboardResponse";

import { useQuery } from "@tanstack/react-query";

export const useClassLeaderboard = () => {
  return useQuery({
    queryKey: ["class-leaderboard"],
    queryFn: async () => {
      const res = await leaderboardProvider.getClassLeaderboard();
      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: ClassLeaderboardResponse[]) =>
      data.map((cl, idx) => ({
        key: cl.id ?? idx,
        ...cl,
      })),
  });
};
