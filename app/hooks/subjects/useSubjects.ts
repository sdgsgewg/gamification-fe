"use client";
import { useQuery } from "@tanstack/react-query";
import { subjectProvider } from "@/app/functions/SubjectProvider";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";

export const useSubjects = (searchText?: string) => {
  return useQuery({
    queryKey: ["subjects", searchText],
    queryFn: async () => {
      const res = await subjectProvider.getSubjects({ searchText });

      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: SubjectOverviewResponse[]) =>
      data.map((s, idx) => ({
        key: s.subjectId ?? idx,
        ...s,
      })),
  });
};
