import z from "zod";

const answerLogSchema = z.object({
  answerLogId: z.string().nullable().optional(),
  questionId: z.string().nonempty("Id pertanyaan wajib diisi"),
  optionId: z.string().nullable(),
  answerText: z.string().nullable(),
  imageFile: z.any().optional(),
});

export const updateTaskAttemptSchema = z.object({
  answeredQuestionCount: z.number(),
  answerLogs: z.array(answerLogSchema).min(1, "Minimal ada satu pertanyaan"),
});

export type UpdateTaskAttemptFormInputs = z.infer<
  typeof updateTaskAttemptSchema
>;

export const updateTaskAttemptDefaultValues: UpdateTaskAttemptFormInputs = {
  answeredQuestionCount: 0,
  answerLogs: [
    {
      answerLogId: "",
      questionId: "",
      optionId: "",
      answerText: "",
      imageFile: null,
    },
  ],
};
