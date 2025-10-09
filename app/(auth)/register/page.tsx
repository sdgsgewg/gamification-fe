"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterFormInputs } from "@/app/schemas/auth/register";
import RegisterForm from "@/app/components/forms/auth/register-form";
import { RoleOverviewResponse } from "@/app/interface/roles/responses/IRoleOverviewResponse";
import { roleProvider } from "@/app/functions/RoleProvider";
import { ROUTES } from "@/app/constants/routes";

const RegisterPage = () => {
  const router = useRouter();

  const [roleData, setRoleData] = useState<RoleOverviewResponse[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const result = await roleProvider.getRoles();

      const { isSuccess, message, data } = result;

      if (isSuccess && data) {
        setRoleData(data);
      } else {
        console.error("Failed to fetch roles:", message);
      }
    };

    fetchRoles();
  }, []);

  const handleRegisterSuccess = (values: RegisterFormInputs) => {
    sessionStorage.setItem("userEmail", values.email);
    router.push(ROUTES.AUTH.EMAIL_VERIFICATION);
  };

  return <RegisterForm roleData={roleData} onFinish={handleRegisterSuccess} />;
};

export default RegisterPage;
