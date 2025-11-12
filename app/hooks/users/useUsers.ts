"use client";
import { userProvider } from "@/app/functions/UserProvider";
import { FilterUserRequest } from "@/app/interface/users/requests/IFilterUserRequest";
import { UserOverviewResponse } from "@/app/interface/users/responses/IUserOverviewResponse";
import { useQuery } from "@tanstack/react-query";

export const useUsers = (values?: FilterUserRequest) => {
  return useQuery({
    queryKey: ["users", values],
    queryFn: async () => {
      const res = await userProvider.getAllUsers(values);
      return res.isSuccess && res.data ? res.data : [];
    },
    select: (data: UserOverviewResponse[]) =>
      data.map((u, idx) => ({
        key: u.userId ?? idx,
        ...u,
      })),
  });
};
