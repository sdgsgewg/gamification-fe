import { Form, Input } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useToast } from "@/app/hooks/use-toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { auth } from "@/app/functions/AuthProvider";
import Button from "../../shared/Button";

// --- Zod Schema ---
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]).*$/,
        "Password must include uppercase, lowercase, number, and special character"
      ),
    confirmPassword: z.string().nonempty("Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormInputs = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
  onFinish: (values: ResetPasswordFormInputs) => void;
}

export default function ResetPasswordForm({
  token,
  onFinish,
}: ResetPasswordFormProps) {
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormInputs>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormInputs) => {
    const result = await auth.resetPassword(token, data.password);
    if (result.ok) {
      toast.success("Berhasil melakukan reset password.");
      onFinish(data);
    } else {
      toast.error("Gagal melakukan reset password. Silahkan coba lagi.");
    }
  };

  return (
    <Form
      name="resetPassword"
      onFinish={handleSubmit(onSubmit)}
      layout="vertical"
      requiredMark={false}
    >
      <div className="p-8 space-y-8">
        <h1 className="text-2xl font-bold">Reset Password Anda</h1>

        <Form.Item
          validateStatus={errors.password ? "error" : ""}
          help={errors.password?.message}
          style={{ marginBottom: errors.password ? "3rem" : "2.5rem" }}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockOutlined style={{ marginRight: 8 }} />}
                placeholder="New Password"
                size="large"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          validateStatus={errors.confirmPassword ? "error" : ""}
          help={errors.confirmPassword?.message}
          style={{ marginBottom: errors.confirmPassword ? "3rem" : "2.5rem" }}
        >
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockOutlined style={{ marginRight: 8 }} />}
                placeholder="Confirm Password"
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
            label="Reset Password"
          />
        </Form.Item>
      </div>
    </Form>
  );
}
