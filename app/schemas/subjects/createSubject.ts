import z from "zod";

export const createSubjectSchema = z.object({
  name: z.string().nonempty("Nama wajib diisi"),
  description: z.string().optional(),
  createdBy: z.string().nonempty("Pengguna wajib diisi"),
  imageFile: z.any().optional(),
});

export type CreateSubjectFormInputs = z.infer<typeof createSubjectSchema>;

export const createSubjectDefaultValues: CreateSubjectFormInputs = {
  name: "",
  description: "",
  createdBy: "",
  imageFile: "",
};
