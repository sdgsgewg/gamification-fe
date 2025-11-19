"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ForgotPasswordForm from "@/app/components/forms/auth/forgot-password-form";
import { ROUTES } from "@/app/constants/routes";

const ForgotPasswordPage = () => {
  const router = useRouter();

  const handleForgotPasswordRequest = () => {
    router.push(ROUTES.AUTH.LOGIN);
  };

  return <ForgotPasswordForm onFinish={handleForgotPasswordRequest} />;
};

export default ForgotPasswordPage;
