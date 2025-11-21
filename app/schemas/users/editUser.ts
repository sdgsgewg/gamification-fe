import z from "zod";

export const editUserSchema = z.object({
  userId: z.string().nonempty("Id wajib diisi"),
  name: z.string().nonempty("Nama wajib diisi"),
  username: z.string().nonempty("Username must be filled"),
  gradeId: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  dob: z.date().optional().nullable(),
  image: z.string().optional().nullable(),
  imageFile: z.any().optional().nullable(),
});

export type EditUserFormInputs = z.infer<typeof editUserSchema>;

export const editUserDefaultValues: EditUserFormInputs = {
  userId: "",
  name: "",
  username: "",
  gradeId: "",
  gender: "",
  phone: "",
  dob: undefined,
  image: "",
  imageFile: null,
};
