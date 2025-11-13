import z from "zod";

export const filterTaskTypeSchema = z.object({
  searchText: z.string().optional(),
  scope: z.string().optional(),
  hasDeadline: z.string().optional(),
  isRepeatable: z.string().optional(),
  orderBy: z.string().optional(),
  orderState: z.string().optional(),
});

export type FilterTaskTypeFormInputs = z.infer<typeof filterTaskTypeSchema>;

export const filterTaskTypeDefaultValues: FilterTaskTypeFormInputs = {
  searchText: "",
  scope: "",
  hasDeadline: "",
  isRepeatable: "",
  orderBy: "createdAt",
  orderState: "DESC",
};
