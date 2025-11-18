"use client";

import { leaderboardProvider } from "@/app/functions/LeaderboardProvider";
import { LeaderboardResponse } from "@/app/interface/leaderboards/responses/ILeaderboardResponse";

import { useQuery } from "@tanstack/react-query";

export const useStudentLeaderboard = () => {
  return useQuery({
    queryKey: ["student-leaderboard"],
    queryFn: async () => {
      const res = await leaderboardProvider.getStudentLeaderboard();

      console.log(
        "Student Leaderboard Response:",
        JSON.stringify(res, null, 2)
      );

      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: LeaderboardResponse[]) =>
      data.map((cl, idx) => ({
        key: cl.id ?? idx,
        ...cl,
      })),
  });
};
