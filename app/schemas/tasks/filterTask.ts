import z from "zod";

export const filterTaskSchema = z.object({
  searchText: z.string().optional(),
  subjectId: z.string().optional(),
  materialId: z.string().optional(),
  taskTypeId: z.string().optional(),
  gradeIds: z.array(z.string()).optional(),
  orderBy: z.string().optional(),
  orderState: z.string().optional(),
});

export type FilterTaskFormInputs = z.infer<typeof filterTaskSchema>;

export const filterTaskDefaultValues: FilterTaskFormInputs = {
  searchText: "",
  subjectId: "",
  materialId: "",
  taskTypeId: "",
  gradeIds: [],
  orderBy: "createdAt",
  orderState: "DESC",
};
