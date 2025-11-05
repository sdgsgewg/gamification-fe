"use client";

import { Form } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useToast } from "@/app/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
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
import { ROUTES } from "@/app/constants/routes";
import AuthDivider from "../../pages/Auth/AuthDivider";

interface RegisterFormProps {
  roleData: RoleOverviewResponse[];
  onFinish: (values: RegisterFormInputs) => void;
}

export default function RegisterForm({
  roleData,
  onFinish,
}: RegisterFormProps) {
  const router = useRouter();
  const { register } = useAuth();
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
    setIsLoading(true);

    // Send only the fields required by the backend
    const payload: RegisterRequest = {
      email: data.email,
      password: data.password,
      roleId: data.roleId,
    };

    const result = await register(payload);
    const { isSuccess, message } = result;

    if (isSuccess) {
      toast.success(message ?? "Registration successful!");
      onFinish(data);
    } else {
      toast.error(message ?? "Registration failed.");
    }

    setIsLoading(false);
  };

  const handleOAuthRegister = () => {
    // Handle OAuth register logic here
  };

  const handleNavigateToLogin = () => {
    router.push(ROUTES.AUTH.LOGIN);
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
                title="Welcome to Gamification"
                subtitle="Please create your account."
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
                placeholder="Enter your email"
                errors={errors}
                required
                prefixIcon={<MailOutlined style={{ marginRight: 8 }} />}
              />

              <PasswordField
                control={control}
                name="password"
                placeholder="Enter your password"
                errors={errors}
                required
                prefixIcon={<LockOutlined style={{ marginRight: 8 }} />}
              />

              <PasswordField
                control={control}
                name="confirmPassword"
                placeholder="Confirm your password"
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
                  Register
                </Button>
              </Form.Item>

              <AuthDivider />

              <OAuthButton
                message="Continue with Google"
                onClick={handleOAuthRegister}
              />
            </>
          }
          bottom={
            <AuthRedirect
              message="Already have an account?"
              linkText="Sign in now"
              onClick={handleNavigateToLogin}
            />
          }
        />
      </Form>
    </>
  );
}