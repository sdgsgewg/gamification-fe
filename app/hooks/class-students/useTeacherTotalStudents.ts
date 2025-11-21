"use client";

import { classStudentProvider } from "@/app/functions/ClassStudentProvider";
import { ClassStudentOverviewResponse } from "@/app/interface/class-students/response/IClassStudentOverviewResponse";
import { useQuery } from "@tanstack/react-query";

export const useTeacherTotalStudents = () => {
  return useQuery({
    queryKey: ["teacher-total-students"],
    queryFn: async () => {
      const res = await classStudentProvider.getTeacherTotalStudents();
      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: ClassStudentOverviewResponse[]) =>
      data.map((cs, idx) => ({
        key: cs.id ?? idx,
        ...cs,
      })),
  });
};
