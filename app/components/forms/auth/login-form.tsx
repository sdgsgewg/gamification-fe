"use client";

import { Form, Checkbox, Divider } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useToast } from "@/app/hooks/use-toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { auth } from "@/app/functions/AuthProvider";
import Button from "../../shared/Button";
import OAuthButton from "../../pages/Auth/OAuthButton";
import AuthRedirect from "../../pages/Auth/AuthRedirect";
import FormLayout from "@/app/(auth)/form-layout";
import TextField from "../../fields/TextField";
import PasswordField from "../../fields/PasswordField";
import {
  loginDefaultValues,
  LoginFormInputs,
  loginSchema,
} from "@/app/schemas/auth/login";
import { useState } from "react";
import Loading from "../../shared/Loading";
import FormTitle from "../../pages/Auth/FormTitle";

interface LoginFormProps {
  onFinish: (values: LoginFormInputs) => void;
  onForgotPasswordClick: () => void;
}

export default function LoginForm({
  onFinish,
  onForgotPasswordClick,
}: LoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);

    const result = await auth.login(data);

    if (result.isSuccess) {
      toast.success(result.message ?? "Login berhasil!");
      onFinish(data);
    } else {
      toast.error(result.message ?? "Invalid credentials");
    }

    setIsLoading(false);
  };

  const handleOAuthLogin = () => {
    // Handle OAuth login logic here
    // window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  const handleNavigateToRegister = () => {
    router.push("/register");
  };

  return (
    <>
      {isLoading && <Loading />}

      <Form
        name="login"
        onFinish={handleSubmit(onSubmit)}
        layout="vertical"
        requiredMark={false}
      >
        <FormLayout
          top={
            <>
              <FormTitle title="Masuk ke Gamification" />

              <TextField
                control={control}
                name="email"
                placeholder="Masukkan email"
                errors={errors}
                required
                prefixIcon={<MailOutlined style={{ marginRight: 8 }} />}
              />

              <PasswordField
                control={control}
                name="password"
                placeholder="Masukkan kata sandi"
                errors={errors}
                required
                prefixIcon={<LockOutlined style={{ marginRight: 8 }} />}
              />

              <div className="flex items-center justify-between">
                <Controller
                  name="remember"
                  control={control}
                  render={({ field }) => (
                    <Checkbox checked={field.value} onChange={field.onChange}>
                      Ingat Saya?
                    </Checkbox>
                  )}
                />
                <Button
                  type="link"
                  onClick={onForgotPasswordClick}
                  className="!text-[#4F68F8]"
                >
                  Lupa Password?
                </Button>
              </div>

              <Form.Item className="!m-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  variant="primary"
                >
                  Masuk
                </Button>
              </Form.Item>

              <Divider
                style={{
                  color: "#000000",
                }}
                className="!m-0"
              >
                OR
              </Divider>

              <OAuthButton
                message="Continue with Google"
                onClick={handleOAuthLogin}
              />
            </>
          }
          bottom={
            <AuthRedirect
              message="Belum punya akun?"
              linkText="Daftar sekarang"
              onClick={handleNavigateToRegister}
            />
          }
        />
      </Form>
    </>
  );
}
