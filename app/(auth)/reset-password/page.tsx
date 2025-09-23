"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ResetPasswordFormInputs } from "@/app/schemas/auth/resetPassword";
import ResetPasswordForm from "@/app/components/forms/auth/reset-password-form";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleResetPasswordRequest = (values: ResetPasswordFormInputs) => {
    console.log("Reset password request for:", values);
    router.push("/login");
  };

  return (
    <ResetPasswordForm
      token={token ?? ""}
      onFinish={handleResetPasswordRequest}
    />
  );
}
