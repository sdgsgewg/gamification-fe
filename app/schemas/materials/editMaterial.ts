import { z } from "zod";

export const editMaterialSchema = z.object({
  name: z.string().nonempty("Nama wajib diisi"),
  subjectId: z.string().nonempty("Mata pelajaran wajib dipilih"),
  description: z.string().optional(),
  gradeIds: z.array(z.string()).nonempty("Tingkat kelas wajib dipilih"),
  image: z.string().optional(),
  updatedBy: z.string().nonempty("Pengguna wajib diisi"),
});

export type EditMaterialFormInputs = z.infer<typeof editMaterialSchema>;
