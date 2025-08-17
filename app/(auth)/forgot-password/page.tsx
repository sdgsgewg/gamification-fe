"use client";

import ForgotPasswordForm, {
  ForgotPasswordInputs,
} from "@/app/components/forms/auth/forgot-password-form";
import { useRouter } from "next/navigation";
import React from "react";
import FormLayout from "../form-layout";

const ForgotPasswordPage = () => {
  const router = useRouter();

  const handleForgotPasswordRequest = (values: ForgotPasswordInputs) => {
    console.log("Forgot password request for:", values);
    router.push("/login");
  };

  return (
    <FormLayout>
      <ForgotPasswordForm onFinish={handleForgotPasswordRequest} />
    </FormLayout>
  );
};

export default ForgotPasswordPage;
