"use client";

import LoginForm, {
  LoginFormInputs,
} from "@/app/components/forms/auth/login-form";
import { useRouter } from "next/navigation";
import React from "react";
import FormLayout from "../form-layout";

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
    <FormLayout>
      <LoginForm
        onFinish={handleLoginSuccess}
        onForgotPasswordClick={handleNavigateToForgotPassword}
      />
    </FormLayout>
  );
};

export default LoginPage;
