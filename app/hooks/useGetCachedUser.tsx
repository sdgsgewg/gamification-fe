"use client";

import { useEffect, useState, useCallback } from "react";
import { Role } from "@/app/enums/Role";
import { authEventTarget, useAuth } from "./auth/useAuth";
import { UserDetailResponse } from "../interface/users/responses/IUserDetailResponse";

// Normalize role safely based on enum values
const normalizeRole = (raw: string): Role => {
  const match = Object.values(Role).find(
    (val) => val.toLowerCase() === raw.toLowerCase()
  );
  return match || Role.GUEST;
};

export const useGetCachedUser = () => {
  const {
    getCachedUserProfile,
    isLoggedIn,
    loading: authLoading,
    fetchUserProfile,
  } = useAuth();

  const [user, setUser] = useState<UserDetailResponse>();
  const [role, setRole] = useState<Role>(Role.GUEST);
  const [loading, setLoading] = useState(true);

  const updateUser = useCallback(async () => {
    setLoading(true);

    let cached = getCachedUserProfile();

    // If logged in but no cached data yet → fetch profile once
    if (!cached && isLoggedIn) {
      cached = await fetchUserProfile(); // useAuth will auto cache it
    }

    if (cached) {
      setUser(cached);

      const raw =
        typeof cached.role === "string"
          ? cached.role
          : cached.role?.name || "Guest";

      setRole(normalizeRole(raw));
    } else {
      setUser(undefined);
      setRole(Role.GUEST);
    }

    setLoading(false);
  }, [getCachedUserProfile, fetchUserProfile, isLoggedIn]);

  // Sync with auth changes
  useEffect(() => {
    updateUser();
    const listener = () => updateUser();
    authEventTarget.addEventListener("authChanged", listener);
    return () => authEventTarget.removeEventListener("authChanged", listener);
  }, [updateUser]);

  return {
    user,
    role,
    isLoggedIn,
    loading: loading || authLoading,
  };
};
