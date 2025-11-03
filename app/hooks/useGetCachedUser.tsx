"use client";

import { useEffect, useState } from "react";
import { Role } from "@/app/enums/Role";
import { UserDetailResponse } from "@/app/interface/users/responses/IUserDetailResponse";
import { authEventTarget, useAuth } from "./useAuth";

interface UseGetCachedUserResult {
  user: UserDetailResponse | undefined;
  role: Role;
  isLoggedIn: boolean;
  loading: boolean;
}

/**
 * Hook untuk mendapatkan user & role dari useAuth
 * dan otomatis update saat login/logout karena useAuth reactive.
 */
export const useGetCachedUser = (): UseGetCachedUserResult => {
  const { getCachedUserProfile, isLoggedIn, loading } = useAuth();

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

  useEffect(() => {
    let isMounted = true;

    const updateUser = () => {
      const cachedUser = getCachedUserProfile();

      if (!isMounted) return;

      if (cachedUser) {
        setUser(cachedUser);

        // Bisa string atau object
        const roleValue =
          typeof cachedUser.role === "string"
            ? cachedUser.role
            : cachedUser.role?.name;

        setRole(parseRole(roleValue));
      } else {
        setUser(undefined);
        setRole(Role.GUEST);
      }
    };

    updateUser(); // fetch awal

    const handleAuthChange = () => updateUser(); // update otomatis saat login/logout

    authEventTarget.addEventListener("authChanged", handleAuthChange);

    return () => {
      isMounted = false;
      authEventTarget.removeEventListener("authChanged", handleAuthChange);
    };
  }, []);

  return { user, role, isLoggedIn, loading };
};
