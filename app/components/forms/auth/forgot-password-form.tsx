import { Form, Input } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useToast } from "@/app/hooks/use-toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { auth } from "@/app/functions/AuthProvider";
import Button from "../../shared/Button";

// --- Zod Schema for Validation ---
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Please enter a valid email!"),
});

export type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onFinish: (values: ForgotPasswordInputs) => void;
}

export default function ForgotPasswordForm({
  onFinish,
}: ForgotPasswordFormProps) {
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInputs) => {
    const result = await auth.forgotPassword(data);
    if (result.ok) {
      toast.success("If an account exists, a reset link has been sent.");
      onFinish(data);
    } else {
      toast.error("Failed to send reset link. Please try again.");
    }
  };

  return (
    <Form
      name="forgotPassword"
      onFinish={handleSubmit(onSubmit)}
      layout="vertical"
      requiredMark={false}
    >
      <div className="p-8 space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Lupa Password</h1>
          <p className="text-base font-medium">
            Masukkan alamat email Anda dan kami akan mengirimkan tautan untuk
            mengatur ulang kata sandi Anda.
          </p>
        </div>

        <Form.Item
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.message}
          style={{ marginBottom: errors.email ? "3rem" : "2.5rem" }}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<MailOutlined style={{ marginRight: 8 }} />}
                placeholder="Email"
                size="large"
              />
            )}
          />
        </Form.Item>

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
      </div>
    </Form>
  );
}
