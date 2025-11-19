"use client";

import { useEffect, useState, useCallback } from "react";
import { Role } from "@/app/enums/Role";
import { UserDetailResponse } from "@/app/interface/users/responses/IUserDetailResponse";
import { authEventTarget, useAuth } from "./auth/useAuth";
import { getLocal, setLocal } from "../utils/storage";

interface UseGetCachedUserResult {
  user: UserDetailResponse | undefined;
  role: Role;
  isLoggedIn: boolean;
  loading: boolean;
}

export const useGetCachedUser = (): UseGetCachedUserResult => {
  const { getCachedUserProfile, isLoggedIn, loading, fetchUserProfile } =
    useAuth();

  const [user, setUser] = useState<UserDetailResponse>();
  const [role, setRole] = useState<Role>(Role.GUEST);

  const parseRole = (value: string): Role => {
    switch (value.toLowerCase()) {
      case "admin":
        return Role.ADMIN;
      case "teacher":
        return Role.TEACHER;
      case "student":
        return Role.STUDENT;
      default:
        return Role.GUEST;
    }
  };

  const updateUser = useCallback(async () => {
    let cachedUser = getCachedUserProfile();

    if (!cachedUser && isLoggedIn) {
      // fallback: try localStorage
      const localUser = getLocal("userProfile");
      if (localUser) {
        try {
          cachedUser = JSON.parse(localUser);
        } catch {
          cachedUser = undefined;
        }
      }

      // kalau masih tidak ada, fetch dari API
      if (!cachedUser) {
        try {
          const profile = await fetchUserProfile();
          cachedUser = profile;
          // simpan ke localStorage supaya next reload cepat
          if (profile) setLocal("userProfile", JSON.stringify(profile));
        } catch {
          cachedUser = undefined;
        }
      }
    }

    if (cachedUser) {
      setUser(cachedUser);

      const roleValue =
        typeof cachedUser.role === "string"
          ? cachedUser.role
          : cachedUser.role?.name;

      setRole(parseRole(roleValue));
    } else {
      setUser(undefined);
      setRole(Role.GUEST);
    }
  }, [fetchUserProfile, getCachedUserProfile, isLoggedIn]);

  useEffect(() => {
    updateUser();

    const handleAuthChange = () => updateUser();
    authEventTarget.addEventListener("authChanged", handleAuthChange);

    return () => {
      authEventTarget.removeEventListener("authChanged", handleAuthChange);
    };
  }, [updateUser]);

  return { user, role, isLoggedIn, loading };
};
