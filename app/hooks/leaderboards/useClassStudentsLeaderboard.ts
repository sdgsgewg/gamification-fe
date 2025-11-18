"use client";

import { leaderboardProvider } from "@/app/functions/LeaderboardProvider";
import { ClassStudentsLeaderboardResponse } from "@/app/interface/leaderboards/responses/IClassStudentsLeaderboardResponse";
import { useQuery } from "@tanstack/react-query";

export const useClassStudentsLeaderboard = (classId: string) => {
  return useQuery({
    queryKey: ["class-students-leaderboard", classId],
    queryFn: async () => {
      const res = await leaderboardProvider.getClassStudentsLeaderboard(
        classId
      );
      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: ClassStudentsLeaderboardResponse[]) =>
      data.map((csl, idx) => ({
        key: csl.id ?? idx,
        ...csl,
      })),
  });
};
