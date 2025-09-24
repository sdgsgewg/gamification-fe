"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ForgotPasswordInputs } from "@/app/schemas/auth/forgotPassword";
import ForgotPasswordForm from "@/app/components/forms/auth/forgot-password-form";

const ForgotPasswordPage = () => {
  const router = useRouter();

  const handleForgotPasswordRequest = (values: ForgotPasswordInputs) => {
    console.log("Forgot password request for:", values);
    router.push("/login");
  };

  return <ForgotPasswordForm onFinish={handleForgotPasswordRequest} />;
};

export default ForgotPasswordPage;
