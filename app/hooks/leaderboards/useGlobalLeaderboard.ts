"use client";
import { leaderboardProvider } from "@/app/functions/LeaderboardProvider";
import { GlobalLeaderboardResponse } from "@/app/interface/leaderboards/responses/IGlobalLeaderboardResponse";
import { useQuery } from "@tanstack/react-query";

export const useGlobalLeaderboard = () => {
  return useQuery({
    queryKey: ["global-leaderboard"],
    queryFn: async () => {
      const res = await leaderboardProvider.getGlobalLeaderboard();
      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: GlobalLeaderboardResponse[]) =>
      data.map((gl, idx) => ({
        key: gl.id ?? idx,
        ...gl,
      })),
  });
};
