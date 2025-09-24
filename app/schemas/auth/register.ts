import z from "zod";

export const registerSchema = z
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
    roleId: z.string().nonempty("Peran wajib dipilih"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterFormInputs = z.infer<typeof registerSchema>;

export const registerDefaultValues: RegisterFormInputs = {
  email: "",
  password: "",
  confirmPassword: "",
  roleId: "",
};

export type RegisterRequest = Omit<RegisterFormInputs, "confirmPassword">;
