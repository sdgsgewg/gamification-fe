import { Form } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/hooks/use-toast";
import { useForm } from "react-hook-form";
import { useAuth } from "@/app/hooks/useAuth";
import Button from "../../shared/Button";
import {
  forgotPasswordDefaultValues,
  ForgotPasswordInputs,
  forgotPasswordSchema,
} from "@/app/schemas/auth/forgotPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import FormTitle from "../../pages/Auth/FormTitle";
import Loading from "../../shared/Loading";
import FormLayout from "@/app/(auth)/form-layout";
import TextField from "../../fields/TextField";
import AuthRedirect from "../../pages/Auth/AuthRedirect";
import { ROUTES } from "@/app/constants/routes";

interface ForgotPasswordFormProps {
  onFinish: (values: ForgotPasswordInputs) => void;
}

export default function ForgotPasswordForm({
  onFinish,
}: ForgotPasswordFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { forgotPassword } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: forgotPasswordDefaultValues,
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: ForgotPasswordInputs) => {
    setIsLoading(true);

    const result = await forgotPassword(data);

    const { isSuccess, message } = result;

    if (isSuccess) {
      toast.success(
        message ?? "If your email is registered, a reset link has been sent."
      );
      onFinish(data);
    } else {
      toast.error(message ?? "Failed to send reset link. Please try again.");
    }

    setIsLoading(false);
  };

  const handleNavigateToLogin = () => {
    router.push(ROUTES.AUTH.LOGIN);
  };

  return (
    <>
      {isLoading && <Loading />}

      <Form
        name="forgotPassword"
        onFinish={handleSubmit(onSubmit)}
        layout="vertical"
        requiredMark={false}
      >
        <FormLayout
          top={
            <>
              <FormTitle
                title="Forgot Password"
                subtitle="Enter your email address and we’ll send you a link to reset your password."
              />

              <TextField
                control={control}
                name="email"
                placeholder="Enter your email"
                errors={errors}
                required
                prefixIcon={<MailOutlined style={{ marginRight: 8 }} />}
              />

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  variant="primary"
                >
                  Continue
                </Button>
              </Form.Item>
            </>
          }
          bottom={
            <AuthRedirect
              message="Remembered your password?"
              linkText="Sign in now"
              onClick={handleNavigateToLogin}
            />
          }
        />
      </Form>
    </>
  );
}