import z from "zod";

export const resetPasswordSchema = z
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

export const resetPasswordDefaultValues: ResetPasswordFormInputs = {
  password: "",
  confirmPassword: "",
};
