"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import Loading from "../components/shared/Loading";
import { Role } from "../enums/Role";
import { useGetCachedUser } from "../hooks/useGetCachedUser";
import { ROUTES } from "../constants/routes";

const DashboardRedirectPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { user } = useGetCachedUser();

  useEffect(() => {
    if (token) {
      localStorage.setItem("access_token", token);
    }

    if (!user) return;

    console.log("User: ", JSON.stringify(user, null, 2));

    const role = user.role.name ?? "";

    switch (role) {
      case Role.ADMIN:
        router.replace(`${ROUTES.DASHBOARD.ADMIN.HOME}`);
        break;
      case Role.TEACHER:
        router.replace(`${ROUTES.DASHBOARD.TEACHER.HOME}`);
        break;
      case Role.STUDENT:
        router.replace(`${ROUTES.DASHBOARD.STUDENT.HOME}`);
        break;
      default:
        router.replace(`${ROUTES.AUTH.LOGIN}`);
    }
  }, [router, token, user]);

  return <Loading />;
};

export default function DashboardRedirectPage() {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardRedirectPageContent />
    </Suspense>
  );
}
