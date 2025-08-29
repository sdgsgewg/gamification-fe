import { Form, Input, Divider, Radio } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useToast } from "@/app/hooks/use-toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { auth } from "@/app/functions/AuthProvider";
import OAuthButton from "../../pages/Auth/OAuthButton";
import AuthRedirect from "../../pages/Auth/AuthRedirect";
import Button from "../../shared/Button";

// --- Zod Schema ---
const registerSchema = z
  .object({
    email: z
      .string()
      .nonempty("Email wajib diisi")
      .email("Mohon masukkan email yang valid!"),
    password: z
      .string()
      .nonempty("Kata sandi wajib diisi")
      .min(8, "Kata sandi harus terdiri dari minimal 8 karakter")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?]).*$/,
        "Kata sandi harus mengandung huruf besar, huruf kecil, angka, dan karakter khusus"
      ),
    confirmPassword: z.string().nonempty("Konfirmasi kata sandi wajib diisi"),
    role: z.string().nonempty("Peran wajib dipilih"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterFormInputs = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onFinish: (values: RegisterFormInputs) => void;
}

export default function RegisterForm({ onFinish }: RegisterFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    const result = await auth.register(data);
    if (result.ok) {
      toast.success("Register successful!");
      onFinish(data);
    } else {
      toast.error(result.error || "Registration failed.");
    }
  };

  const handleOAuthRegister = () => {
    // Handle OAuth register logic here
  };

  const handleNavigateToLogin = () => {
    router.push("/login");
  };

  return (
    <Form
      name="register"
      onFinish={handleSubmit(onSubmit)}
      layout="vertical"
      requiredMark={false}
    >
      <div className="p-8 space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Selamat Datang di Gamification</h1>
          <p className="text-base font-medium">Silahkan buat akun anda.</p>
        </div>

        {/* Role Field */}
        <Form.Item
          label={
            <span className="font-medium">Anda membuat akun sebagai?</span>
          }
          validateStatus={errors.role ? "error" : ""}
          help={errors.role?.message}
          style={{ marginBottom: errors.role ? "2.5rem" : "2rem" }}
        >
          <Controller
            name="role"
            control={control}
            rules={{ required: "Silakan pilih peran Anda!" }}
            render={({ field }) => (
              <Radio.Group
                {...field}
                size="large"
                style={{
                  width: "100%",
                  display: "flex",
                  gap: "1rem",
                }}
              >
                <Radio
                  value="student"
                  style={{
                    padding: "0.7rem 1rem",
                    color: field.value === "student" ? "#2563EB" : "#374151",
                    fontWeight: field.value === "student" ? "600" : "400",
                  }}
                  className={`w-1/2 border rounded-md ${
                    field.value === "student"
                      ? "border-blue-600"
                      : "border-gray-300"
                  }`}
                >
                  Siswa
                </Radio>

                <Radio
                  value="teacher"
                  style={{
                    padding: "0.7rem 1rem",
                    color: field.value === "teacher" ? "#2563EB" : "#374151",
                    fontWeight: field.value === "teacher" ? "600" : "400",
                  }}
                  className={`w-1/2 border rounded-md ${
                    field.value === "teacher"
                      ? "border-blue-600"
                      : "border-gray-300"
                  }`}
                >
                  Guru
                </Radio>
              </Radio.Group>
            )}
          />
        </Form.Item>

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

        <Form.Item
          validateStatus={errors.confirmPassword ? "error" : ""}
          help={errors.confirmPassword?.message}
          style={{ marginBottom: errors.confirmPassword ? "2.5rem" : "2rem" }}
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
            label="Daftar"
          />
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
          onClick={handleOAuthRegister}
        />
      </div>

      <AuthRedirect
        message="Sudah punya akun?"
        linkText="Masuk sekarang"
        onClick={handleNavigateToLogin}
      />
    </Form>
  );
}
