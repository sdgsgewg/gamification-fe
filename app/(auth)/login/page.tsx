"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LoginFormInputs } from "@/app/schemas/auth/login";
import LoginForm from "@/app/components/forms/auth/login-form";

const LoginPage = () => {
  const router = useRouter();

  const handleLoginSuccess = (values: LoginFormInputs) => {
    console.log("Login successful with:", values);
    router.push("/dashboard");
  };

  const handleNavigateToForgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <LoginForm
      onFinish={handleLoginSuccess}
      onForgotPasswordClick={handleNavigateToForgotPassword}
    />
  );
};

export default LoginPage;
