"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, Form } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useToast } from "@/app/hooks/use-toast";
import { postAxios } from "@/app/utils/AxiosFunction";
import ResetPasswordForm, {
  ResetPasswordFormInputs,
} from "@/app/components/forms/auth/reset-password-form";
import FormLayout from "../form-layout";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleResetPasswordRequest = (values: ResetPasswordFormInputs) => {
    console.log("Reset password request for:", values);
    router.push("/login");
  };

  return (
    <FormLayout>
      <ResetPasswordForm
        token={token ?? ""}
        onFinish={handleResetPasswordRequest}
      />
    </FormLayout>
  );
}
