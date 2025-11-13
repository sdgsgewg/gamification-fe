"use client";

import { Form } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useToast } from "@/app/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/app/hooks/useAuth";
import Button from "../../shared/Button";
import {
  resetPasswordDefaultValues,
  ResetPasswordFormInputs,
  resetPasswordSchema,
} from "@/app/schemas/auth/resetPassword";
import { useState } from "react";
import Loading from "../../shared/Loading";
import FormTitle from "../../pages/Auth/FormTitle";
import PasswordField from "../../fields/PasswordField";
import FormLayout from "@/app/(auth)/form-layout";

interface ResetPasswordFormProps {
  token: string;
  onFinish: (values: ResetPasswordFormInputs) => void;
}

export default function ResetPasswordForm({
  token,
  onFinish,
}: ResetPasswordFormProps) {
  const { toast } = useToast();
  const { resetPassword } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormInputs>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: resetPasswordDefaultValues,
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: ResetPasswordFormInputs) => {
    setIsLoading(true);

    const result = await resetPassword(token, data.password);

    const { isSuccess, message } = result;

    if (isSuccess) {
      toast.success(message ?? "Berhasil melakukan reset password.");
      onFinish(data);
    } else {
      toast.error(
        message ?? "Gagal melakukan reset password. Silahkan coba lagi."
      );
    }

    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <Loading />}

      <Form
        name="resetPassword"
        onFinish={handleSubmit(onSubmit)}
        layout="vertical"
        requiredMark={false}
      >
        <FormLayout
          top={
            <>
              <FormTitle title="Reset Password Anda" />

              <PasswordField
                control={control}
                name="password"
                placeholder="Masukkan kata sandi baru"
                errors={errors}
                required
                prefixIcon={<LockOutlined style={{ marginRight: 8 }} />}
              />

              <PasswordField
                control={control}
                name="confirmPassword"
                placeholder="Masukkan konfirmasi kata sandi"
                errors={errors}
                required
                prefixIcon={<LockOutlined style={{ marginRight: 8 }} />}
              />

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  variant="primary"
                >
                  Reset Password
                </Button>
              </Form.Item>
            </>
          }
        />
      </Form>
    </>
  );
}
