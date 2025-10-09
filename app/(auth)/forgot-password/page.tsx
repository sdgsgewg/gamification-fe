"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ForgotPasswordInputs } from "@/app/schemas/auth/forgotPassword";
import ForgotPasswordForm from "@/app/components/forms/auth/forgot-password-form";
import { ROUTES } from "@/app/constants/routes";

const ForgotPasswordPage = () => {
  const router = useRouter();

  const handleForgotPasswordRequest = (values: ForgotPasswordInputs) => {
    console.log("Forgot password request for:", values);
    router.push(ROUTES.AUTH.LOGIN);
  };

  return <ForgotPasswordForm onFinish={handleForgotPasswordRequest} />;
};

export default ForgotPasswordPage;
