import z from "zod";

export const createMaterialSchema = z.object({
  name: z.string().nonempty("Nama wajib diisi"),
  subjectId: z.string().nonempty("Mata pelajaran wajib dipilih"),
  description: z.string().optional(),
  gradeIds: z.array(z.string()).nonempty("Tingkat kelas wajib dipilih"),
  createdBy: z.string().nonempty("Pengguna wajib diisi"),
  imageFile: z.any().optional(),
});

export type CreateMaterialFormInputs = z.infer<typeof createMaterialSchema>;

export const createMaterialDefaultValues = {
  name: "",
  subjectId: "",
  description: "",
  gradeIds: [],
  createdBy: "",
  imageFile: "",
};
