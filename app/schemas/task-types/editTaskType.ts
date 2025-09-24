import z from "zod";

export const editTaskTypeSchema = z.object({
  taskTypeId: z.string().nonempty("Id wajib diisi"),
  name: z.string().nonempty("Nama wajib diisi"),
  description: z.string().optional(),
  scope: z.string().nonempty(),
  hasDeadline: z.string().nonempty("Has Deadline wajib diisi"),
  isCompetitive: z.string().nonempty("Is Competitive wajib diisi"),
  isRepeatable: z.string().nonempty("Is Repeatable wajib diisi"),
  pointMultiplier: z
    .number()
    .min(1, "Point Multiplier minimal 1")
    .nonoptional(),
  updatedBy: z.string().nonempty("Pengguna wajib diisi"),
});

export type EditTaskTypeFormInputs = z.infer<typeof editTaskTypeSchema>;

export const editTaskTypeDefaultValues: EditTaskTypeFormInputs = {
  taskTypeId: "",
  name: "",
  description: "",
  scope: "",
  hasDeadline: "",
  isCompetitive: "",
  isRepeatable: "",
  pointMultiplier: 1,
  updatedBy: "",
};
