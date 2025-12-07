"use client";

import { leaderboardProvider } from "@/app/functions/LeaderboardProvider";
import { FilterStudentLeaderboardRequest } from "@/app/interface/leaderboards/requests/IFilterStudentLeaderboardRequest";
import { StudentLeaderboardResponse } from "@/app/interface/leaderboards/responses/IStudentLeaderboardResponse";

import { useQuery } from "@tanstack/react-query";

export const useStudentLeaderboard = (
  values?: FilterStudentLeaderboardRequest
) => {
  return useQuery({
    queryKey: ["student-leaderboard", values],
    queryFn: async () => {
      const res = await leaderboardProvider.getStudentLeaderboard(values);
      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: StudentLeaderboardResponse[]) =>
      data.map((sl, idx) => ({
        key: sl.id ?? idx,
        ...sl,
      })),
  });
};
