import z from "zod";

export const editTaskTypeSchema = z.object({
  taskTypeId: z.string().nonempty("Id wajib diisi"),
  name: z.string().nonempty("Nama wajib diisi"),
  description: z.string().optional(),
  scope: z.string().nonempty(),
  hasDeadline: z.string().nonempty("Has Deadline wajib diisi"),
  isRepeatable: z.string().nonempty("Is Repeatable wajib diisi"),
  updatedBy: z.string().nonempty("Pengguna wajib diisi"),
});

export type EditTaskTypeFormInputs = z.infer<typeof editTaskTypeSchema>;

export const editTaskTypeDefaultValues: EditTaskTypeFormInputs = {
  taskTypeId: "",
  name: "",
  description: "",
  scope: "",
  hasDeadline: "",
  isRepeatable: "",
  updatedBy: "",
};
