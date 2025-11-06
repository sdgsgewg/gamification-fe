"use client";

import { classProvider } from "@/app/functions/ClassProvider";
import { FilterClassMemberRequest } from "@/app/interface/classes/requests/IFilterClassMemberRequest";
import { ClassMemberResponse } from "@/app/interface/classes/responses/IClassMemberResponse";
import { useQuery } from "@tanstack/react-query";

export const useClassMember = (slug: string, values?: FilterClassMemberRequest) => {
  return useQuery({
    queryKey: ["class-member", slug, values],
    enabled: !!slug,
    queryFn: async () => {
      const res = await classProvider.getClassMembers(slug, values);
      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat anggota kelas");

      const member = res.data;

      const { students, teacher } = member;

      const mapped: ClassMemberResponse = {
        students,
        teacher,
      };

      return mapped;
    },
  });
};
