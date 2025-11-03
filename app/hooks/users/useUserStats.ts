"use client";
import { userProvider } from "@/app/functions/UserProvider";
import { UserStatsResponse } from "@/app/interface/users/responses/IUserStatsResponse";
import { useQuery } from "@tanstack/react-query";

export const useUserStats = () => {
  return useQuery({
    queryKey: ["user-stats"],
    queryFn: async () => {
      const res = await userProvider.getUserStats();

      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat detail statistik pengguna");

      const user = res.data;

      const data: UserStatsResponse = {
        ...user,
      };

      return data;
    },
  });
};
