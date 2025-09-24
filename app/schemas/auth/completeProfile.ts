import z from "zod";

export const completeProfileSchema = z
  .object({
    name: z.string().nonempty("Nama wajib diisi"),
    username: z
      .string()
      .nonempty("Username wajib diisi")
      .min(8, "Username harus terdiri dari minimal 8 karakter")
      .regex(
        /^(?=.*[0-9])[a-zA-Z0-9._]+$/,
        "Username harus terdiri dari huruf atau angka."
      ),
    gradeId: z.string().optional(),
    role: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.role === "student" &&
      (!data.gradeId || data.gradeId.trim() === "")
    ) {
      ctx.addIssue({
        path: ["gradeId"],
        code: "custom",
        message: "Tingkatan kelas wajib dipilih untuk siswa",
      });
    }
  });

export type CompleteProfileFormInputs = z.infer<typeof completeProfileSchema>;

export const completeProfileDefaultValues: CompleteProfileFormInputs = {
  name: "",
  username: "",
  gradeId: "",
  role: "",
};
