import z from "zod";

export const joinClassSchema = z.object({
  classIds: z.array(z.string()).nonempty("Kelas wajib dipilih"),
});

export type JoinClassFormInputs = z.infer<typeof joinClassSchema>;

export const joinClassDefaultValues: JoinClassFormInputs = {
  classIds: [],
};
