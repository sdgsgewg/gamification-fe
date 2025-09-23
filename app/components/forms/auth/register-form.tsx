"use cliet";

import { Form, Divider } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useToast } from "@/app/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { auth } from "@/app/functions/AuthProvider";
import OAuthButton from "../../pages/Auth/OAuthButton";
import AuthRedirect from "../../pages/Auth/AuthRedirect";
import Button from "../../shared/Button";
import {
  registerDefaultValues,
  RegisterFormInputs,
  RegisterRequest,
  registerSchema,
} from "@/app/schemas/auth/register";
import { RoleOverviewResponse } from "@/app/interface/roles/responses/IRoleOverviewResponse";
import { useState } from "react";
import RoleField from "../../fields/RoleField";
import TextField from "../../fields/TextField";
import PasswordField from "../../fields/PasswordField";
import FormLayout from "@/app/(auth)/form-layout";
import Loading from "../../shared/Loading";
import FormTitle from "../../pages/Auth/FormTitle";

interface RegisterFormProps {
  roleData: RoleOverviewResponse[];
  onFinish: (values: RegisterFormInputs) => void;
}

export default function RegisterForm({
  roleData,
  onFinish,
}: RegisterFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: registerDefaultValues,
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: RegisterFormInputs) => {
    console.log("Submit register data: ", JSON.stringify(data, null, 2));

    setIsLoading(true);

    // Kirim hanya field yang dibutuhkan BE
    const payload: RegisterRequest = {
      email: data.email,
      password: data.password,
      roleId: data.roleId,
    };

    const result = await auth.register(payload);

    const { isSuccess, message } = result;

    if (isSuccess) {
      toast.success(message ?? "Registrasi berhasil!");
      onFinish(data);
    } else {
      toast.error(message ?? "Registrasi gagal.");
    }

    setIsLoading(false);
  };

  const handleOAuthRegister = () => {
    // Handle OAuth register logic here
  };

  const handleNavigateToLogin = () => {
    router.push("/login");
  };

  return (
    <>
      {isLoading && <Loading />}

      <Form
        name="register"
        onFinish={handleSubmit(onSubmit)}
        layout="vertical"
        requiredMark={false}
      >
        <FormLayout
          top={
            <>
              <FormTitle
                title="Selamat Datang di Gamification"
                subtitle="Silahkan buat akun anda."
              />

              {/* Role Field */}
              <RoleField
                control={control}
                errors={errors}
                roleData={roleData}
              />

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

              <PasswordField
                control={control}
                name="confirmPassword"
                placeholder="Masukkan konfirmasi kata sandi"
                errors={errors}
                required
                prefixIcon={<LockOutlined style={{ marginRight: 8 }} />}
              />

              <Form.Item className="!m-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  variant="primary"
                >
                  Daftar
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
                onClick={handleOAuthRegister}
              />
            </>
          }
          bottom={
            <AuthRedirect
              message="Sudah punya akun?"
              linkText="Masuk sekarang"
              onClick={handleNavigateToLogin}
            />
          }
        />
      </Form>
    </>
  );
}
