"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/app/functions/AuthProvider";
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

  useEffect(() => {
    if (token) {
      localStorage.setItem("access_token", token);
    }

    const user = auth.getCachedUserProfile();
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
