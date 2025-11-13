"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import Loading from "../components/shared/Loading";

enum Role {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
  GUEST = "GUEST",
}

export default function DashboardRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { getCachedUserProfile } = useAuth();

  useEffect(() => {
    if (token) {
      localStorage.setItem("access_token", token);
    }

    const user = getCachedUserProfile();
    const role = (user?.role?.name || "").toUpperCase();

    switch (role) {
      case Role.ADMIN:
        router.replace("/dashboard/admin");
        break;
      case Role.TEACHER:
        router.replace("/dashboard/teacher");
        break;
      case Role.STUDENT:
        router.replace("/dashboard/student");
        break;
      default:
        router.replace("/auth/login");
    }
  }, [router, token]);

  return <Loading />;
}
