import z from "zod";

export const editSubjectSchema = z.object({
  subjectId: z.string().nonempty("Id wajib diisi"),
  name: z.string().nonempty("Nama wajib diisi"),
  description: z.string().optional(),
  updatedBy: z.string().nonempty("Pengguna wajib diisi"),
  image: z.string().optional(),
  imageFile: z.any().optional(),
});

export type EditSubjectFormInputs = z.infer<typeof editSubjectSchema>;

export const editSubjectDefaultValues: EditSubjectFormInputs = {
  subjectId: "",
  name: "",
  description: "",
  updatedBy: "",
  image: "",
  imageFile: null,
};
