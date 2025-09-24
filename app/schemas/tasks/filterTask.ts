import z from "zod";

export const filterTaskSchema = z.object({
  searchText: z.string().optional(),
  subjectId: z.string().optional(),
  materialId: z.string().optional(),
  taskTypeId: z.string().optional(),
  gradeIds: z.array(z.string()).optional(),
});

export type FilterTaskInputs = z.infer<typeof filterTaskSchema>;

export const filterTaskDefaultValues: FilterTaskInputs = {
  searchText: "",
  subjectId: "",
  materialId: "",
  taskTypeId: "",
  gradeIds: [],
};
