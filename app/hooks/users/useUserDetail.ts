"use client";

import { useQuery } from "@tanstack/react-query";
import { getImageSrc } from "@/app/utils/image";
import { ManageItemMode } from "@/app/types/ManageItemMode";
import { UserDetailResponse } from "@/app/interface/users/responses/IUserDetailResponse";
import { EditUserFormInputs } from "@/app/schemas/users/editUser";
import { userProvider } from "@/app/functions/UserProvider";

type ModeReturnType<M extends ManageItemMode> = M extends "detail"
  ? UserDetailResponse
  : EditUserFormInputs;

export const useUserDetail = <M extends ManageItemMode>(
  username: string,
  mode: M
) => {
  return useQuery<ModeReturnType<M>>({
    queryKey: ["user-detail", username, mode],
    enabled: !!username,
    queryFn: async () => {
      const res = await userProvider.getUserByUsername(username!);
      if (!res.isSuccess || !res.data)
        throw new Error("Gagal memuat detail pengguna");

      const user = res.data;
      const {
        userId,
        name,
        email,
        password,
        gender,
        phone,
        dob,
        image,
        role,
        grade,
        level,
        xp,
        emailVerifiedAt,
        createdAt,
      } = user;

      if (mode === "edit") {
        // Mode edit
        const mapped: EditUserFormInputs = {
          userId,
          name,
          username,
          gender,
          phone,
          dob,
          image: image ? getImageSrc(image) : "",
          imageFile: null,
        };
        return mapped as ModeReturnType<M>;
      }

      // Mode detail
      const mapped: UserDetailResponse = {
        userId,
        name,
        email,
        username,
        password,
        gender,
        phone,
        dob,
        image: image ? getImageSrc(image) : "",
        role,
        grade,
        level,
        xp,
        emailVerifiedAt,
        createdAt,
      };
      return mapped as ModeReturnType<M>;
    },
  });
};
