import z from "zod";

export const filterActivitySchema = z.object({
  section: z.string().optional(),
  searchText: z.string().optional(),
  subjectId: z.string().optional(),
  materialId: z.string().optional(),
  taskTypeId: z.string().optional(),
  gradeIds: z.array(z.string()).optional(),
  userId: z.string().optional(),
});

export type FilterActivityFormInputs = z.infer<typeof filterActivitySchema>;

export const filterActivityDefaultValues: FilterActivityFormInputs = {
  section: "",
  searchText: "",
  subjectId: "",
  materialId: "",
  taskTypeId: "",
  gradeIds: [],
  userId: "",
};
