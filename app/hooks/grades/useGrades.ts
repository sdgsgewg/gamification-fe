"use client";
import { gradeProvider } from "@/app/functions/GradeProvider";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";
import { useQuery } from "@tanstack/react-query";

export const useGrades = () => {
  return useQuery({
    queryKey: ["grades"],
    queryFn: async () => {
      const res = await gradeProvider.getGrades();
      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: GradeOverviewResponse[]) => data,
  });
};
