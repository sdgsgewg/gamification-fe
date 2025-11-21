"use client";

import { useQuery } from "@tanstack/react-query";
import { taskAttemptProvider } from "@/app/functions/TaskAttemptProvider";

export const useMostPopularTask = () => {
  return useQuery({
    queryKey: ["most-popular-task"],
    queryFn: async () => {
      const res = await taskAttemptProvider.getMostPopularTask();
      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat data percobaan tugas paling populer");
      const data = res.data;
      return data;
    },
  });
};
