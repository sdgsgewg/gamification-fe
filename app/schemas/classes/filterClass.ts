import z from "zod";

export const filterClassSchema = z.object({
  searchText: z.string().optional(),
  gradeIds: z.array(z.string()).optional(),
  orderBy: z.string().optional(),
  orderState: z.string().optional(),
});

export type FilterClassFormInputs = z.infer<typeof filterClassSchema>;

export const filterClassDefaultValues: FilterClassFormInputs = {
  searchText: "",
  gradeIds: [],
  orderBy: "createdAt",
  orderState: "DESC",
};
