"use client";

import { userProvider } from "@/app/functions/UserProvider";
import { useQuery } from "@tanstack/react-query";

export const useUserRoleCounts = () => {
  return useQuery({
    queryKey: ["user-role-counts"],
    queryFn: async () => {
      const res = await userProvider.getUserRoleCounts();
      if (!res.isSuccess || !res.data) throw new Error("Gagal memuat data");
      const data = res.data;
      return data;
    },
  });
};
