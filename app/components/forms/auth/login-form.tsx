import { Form, Input, Checkbox, Divider } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useToast } from "@/app/hooks/use-toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { auth } from "@/app/functions/AuthProvider";
import Button from "../../shared/Button";
import OAuthButton from "../../pages/Auth/OAuthButton";
import AuthRedirect from "../../pages/Auth/AuthRedirect";

// --- Zod Schema ---
const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email wajib diisi")
    .email("Masukkan alamat email yang valid!"),
  password: z.string().nonempty("Silakan masukkan kata sandi Anda!"),
  remember: z.boolean().optional(),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;

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
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    const result = await auth.login(data);
    if (result.ok) {
      toast.success("Login successful!");
      onFinish(data);
    } else {
      toast.error(result.error || "Invalid credentials.");
    }
  };

  const handleOAuthLogin = () => {
    // Handle OAuth login logic here
    // window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  const handleNavigateToRegister = () => {
    router.push("/register");
  };

  return (
    <Form
      name="login"
      onFinish={handleSubmit(onSubmit)}
      layout="vertical"
      requiredMark={false}
    >
      <div className="p-8 space-y-8">
        <h1 className="text-2xl font-bold">Masuk ke Gamification</h1>

        <Form.Item
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.message}
          style={{ marginBottom: errors.email ? "2.5rem" : "2rem" }}
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

        <Form.Item
          validateStatus={errors.password ? "error" : ""}
          help={errors.password?.message}
          style={{ marginBottom: errors.password ? "2.5rem" : "2rem" }}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockOutlined style={{ marginRight: 8 }} />}
                placeholder="Password"
                size="large"
              />
            )}
          />
        </Form.Item>

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

        <Form.Item>
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
        >
          OR
        </Divider>

        <OAuthButton
          message="Continue with Google"
          onClick={handleOAuthLogin}
        />
      </div>

      <AuthRedirect
        message="Belum punya akun?"
        linkText="Daftar sekarang"
        onClick={handleNavigateToRegister}
      />
    </Form>
  );
}
