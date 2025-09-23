import z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email wajib diisi")
    .email("Masukkan alamat email yang valid!"),
  password: z.string().nonempty("Silakan masukkan kata sandi Anda!"),
  remember: z.boolean().optional(),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;

export const loginDefaultValues: LoginFormInputs = {
  email: "",
  password: "",
  remember: false,
};
