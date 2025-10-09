import { Form } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/hooks/use-toast";
import { useForm } from "react-hook-form";
import { auth } from "@/app/functions/AuthProvider";
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

    const result = await auth.forgotPassword(data);

    const { isSuccess, message } = result;

    if (isSuccess) {
      toast.success(
        message ?? "Jika email Anda terdaftar, tautan reset telah dikirim."
      );
      onFinish(data);
    } else {
      toast.error(message ?? "Gagal mengirim tautan reset. Mohon coba lagi.");
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
                title="Lupa Password"
                subtitle="Masukkan alamat email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda."
              />

              <TextField
                control={control}
                name="email"
                placeholder="Masukkan email"
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
                  Lanjut
                </Button>
              </Form.Item>
            </>
          }
          bottom={
            <AuthRedirect
              message="Sudah ingat password Anda?"
              linkText="Masuk sekarang"
              onClick={handleNavigateToLogin}
            />
          }
        />
      </Form>
    </>
  );
}
