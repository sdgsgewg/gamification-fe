"use client";

import { useEffect, useState } from "react";
import { auth, authEventTarget } from "@/app/functions/AuthProvider";
import { Role } from "@/app/enums/Role";
import { UserDetailResponse } from "@/app/interface/users/responses/IUserDetailResponse";

interface UseGetCachedUserResult {
  user: UserDetailResponse | undefined;
  role: Role;
  loading: boolean;
}

/**
 * Hook untuk mendapatkan data user yang tersimpan di cache (AuthProvider)
 * dan otomatis update ketika login/logout terjadi.
 */
export const useGetCachedUser = (): UseGetCachedUserResult => {
  const [user, setUser] = useState<UserDetailResponse>();
  const [role, setRole] = useState<Role>(Role.GUEST);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const updateUser = async () => {
      setLoading(true);
      const cachedUser = await auth.getCachedUserProfile();

      if (!isMounted) return;

      if (cachedUser) {
        setUser(cachedUser);
        setRole(cachedUser.role.name);
      } else {
        setUser(undefined);
        setRole(Role.GUEST);
      }

      setLoading(false);
    };

    updateUser(); // fetch awal

    const handleAuthChange = () => updateUser(); // update otomatis saat login/logout

    authEventTarget.addEventListener("authChanged", handleAuthChange);

    return () => {
      isMounted = false;
      authEventTarget.removeEventListener("authChanged", handleAuthChange);
    };
  }, []);

  return { user, role, loading };
};
