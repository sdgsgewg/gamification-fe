import z from "zod";

export const createClassSchema = z.object({
  name: z.string().nonempty("Nama wajib diisi"),
  description: z.string().optional(),
  createdBy: z.string().nonempty("Pengguna wajib diisi"),
  imageFile: z.any().optional(),
  teacherId: z.string().nonempty("Id guru wajib diisi"),
});

export type CreateClassFormInputs = z.infer<typeof createClassSchema>;

export const createClassDefaultValues: CreateClassFormInputs = {
  name: "",
  description: "",
  createdBy: "",
  imageFile: "",
  teacherId: "",
};
