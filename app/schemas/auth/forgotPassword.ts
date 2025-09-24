import z from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Please enter a valid email!"),
});

export type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;

export const forgotPasswordDefaultValues: ForgotPasswordInputs = {
  email: "",
};
