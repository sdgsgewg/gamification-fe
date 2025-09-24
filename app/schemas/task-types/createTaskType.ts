import z from "zod";

export const createTaskTypeSchema = z.object({
  name: z.string().nonempty("Nama wajib diisi"),
  description: z.string().optional(),
  scope: z.string().nonempty("Scope wajib diisi"),
  hasDeadline: z.string().nonempty("Has Deadline wajib diisi"),
  isCompetitive: z.string().nonempty("Is Competitive wajib diisi"),
  isRepeatable: z.string().nonempty("Is Repeatable wajib diisi"),
  pointMultiplier: z
    .number()
    .min(1, "Point Multiplier minimal 1")
    .nonoptional(),
  createdBy: z.string().nonempty("Pengguna wajib diisi"),
});

export type CreateTaskTypeFormInputs = z.infer<typeof createTaskTypeSchema>;

export const createTaskTypeDefaultValues: CreateTaskTypeFormInputs = {
  name: "",
  description: "",
  scope: "",
  hasDeadline: "",
  isCompetitive: "",
  isRepeatable: "",
  pointMultiplier: 1,
  createdBy: "",
};
