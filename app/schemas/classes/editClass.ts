import z from "zod";

export const editClassSchema = z.object({
  classId: z.string().nonempty("Id wajib diisi"),
  name: z.string().nonempty("Nama wajib diisi"),
  description: z.string().optional(),
  updatedBy: z.string().nonempty("Pengguna wajib diisi"),
  image: z.string().optional(),
  imageFile: z.any().optional(),
});

export type EditClassFormInputs = z.infer<typeof editClassSchema>;

export const editClassDefaultValues: EditClassFormInputs = {
  classId: "",
  name: "",
  description: "",
  updatedBy: "",
  image: "",
  imageFile: null,
};
