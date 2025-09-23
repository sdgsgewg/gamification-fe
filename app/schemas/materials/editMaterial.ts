import { z } from "zod";

export const editMaterialSchema = z.object({
  materialId: z.string().nonempty("Id wajib diisi"),
  name: z.string().nonempty("Nama wajib diisi"),
  description: z.string().optional(),
  subjectId: z.string().nonempty("Mata pelajaran wajib dipilih"),
  gradeIds: z.array(z.string()).nonempty("Tingkat kelas wajib dipilih"),
  updatedBy: z.string().nonempty("Pengguna wajib diisi"),
  image: z.string().optional(),
  imageFile: z.any().optional(),
});

export type EditMaterialFormInputs = z.infer<typeof editMaterialSchema>;

export const editMaterialDefaultValues: EditMaterialFormInputs = {
  materialId: "",
  name: "",
  description: "",
  subjectId: "",
  gradeIds: [],
  updatedBy: "",
  image: "",
  imageFile: null,
};
