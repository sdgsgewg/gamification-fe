"use client";

export const dynamic = "force-dynamic";

import { useSearchParams, useRouter } from "next/navigation";
import { ResetPasswordFormInputs } from "@/app/schemas/auth/resetPassword";
import ResetPasswordForm from "@/app/components/forms/auth/reset-password-form";
import { ROUTES } from "@/app/constants/routes";
import { Suspense } from "react";
import Loading from "@/app/components/shared/Loading";

const ResetPasswordPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleResetPasswordRequest = (values: ResetPasswordFormInputs) => {
    console.log("Reset password request for:", values);
    router.push(ROUTES.AUTH.LOGIN);
  };

  return (
    <ResetPasswordForm
      token={token ?? ""}
      onFinish={handleResetPasswordRequest}
    />
  );
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}
