import z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Please enter a valid email address!"),
  password: z.string().nonempty("Please enter your password!"),
  remember: z.boolean().optional(),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;

export const loginDefaultValues: LoginFormInputs = {
  email: "",
  password: "",
  remember: false,
};