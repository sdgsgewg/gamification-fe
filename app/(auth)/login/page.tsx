"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LoginFormInputs } from "@/app/schemas/auth/login";
import LoginForm from "@/app/components/forms/auth/login-form";
import { ROUTES } from "@/app/constants/routes";

const LoginPage = () => {
  const router = useRouter();

  const handleLoginSuccess = (values: LoginFormInputs) => {
    console.log("Login successful with:", values);
    router.push(ROUTES.DASHBOARD.BASE);
  };

  const handleNavigateToForgotPassword = () => {
    router.push(ROUTES.AUTH.FORGOT_PASSWORD);
  };

  return (
    <LoginForm
      onFinish={handleLoginSuccess}
      onForgotPasswordClick={handleNavigateToForgotPassword}
    />
  );
};

export default LoginPage;
