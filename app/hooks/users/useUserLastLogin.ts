"use client";

import { useQuery } from "@tanstack/react-query";
import { userProvider } from "@/app/functions/UserProvider";
import { UserLastLoginResponse } from "@/app/interface/users/responses/IUserLastLoginResponse";

export const useUserLastLogin = () => {
  return useQuery({
    queryKey: ["user-last-login"],
    queryFn: async () => {
      const res = await userProvider.getUserLastLogin();

      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat data login terkahir");

      const loginData = res.data;

      const mapped: UserLastLoginResponse = {
        ...loginData,
      };

      return mapped;
    },
  });
};
