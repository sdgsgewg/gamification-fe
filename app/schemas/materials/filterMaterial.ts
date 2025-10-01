import z from "zod";

export const filterMaterialSchema = z.object({
  searchText: z.string().optional(),
  subjectId: z.string().optional(),
  gradeIds: z.array(z.string()).optional(),
  orderBy: z.string().optional(),
  orderState: z.string().optional(),
});

export type FilterMaterialFormInputs = z.infer<typeof filterMaterialSchema>;

export const filterMaterialDefaultValues: FilterMaterialFormInputs = {
  searchText: "",
  subjectId: "",
  gradeIds: [],
  orderBy: "createdAt",
  orderState: "DESC",
};
