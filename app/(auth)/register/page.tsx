"use client";

import RegisterForm, {
  RegisterFormInputs,
} from "@/app/components/forms/auth/register-form";
import { useRouter } from "next/navigation";
import React from "react";
import FormLayout from "../form-layout";

const RegisterPage = () => {
  const router = useRouter();

  const handleRegisterSuccess = (values: RegisterFormInputs) => {
    sessionStorage.setItem("userEmail", values.email);
    router.push("/email-verification");
  };

  return (
    <FormLayout>
      <RegisterForm onFinish={handleRegisterSuccess} />
    </FormLayout>
  );
};

export default RegisterPage;
