import z from "zod";

const answerLogSchema = z.object({
  questionId: z.string().nonempty("Id pertanyaan wajib diisi"),
  optionId: z.string().nullable(),
  answerText: z.string().nullable(),
  imageFile: z.any().optional(),
});

export const createTaskAttemptSchema = z.object({
  answeredQuestionCount: z.number(),
  taskId: z.string(),
  studentId: z.string(),
  answerLogs: z.array(answerLogSchema).min(1, "Minimal ada satu pertanyaan"),
});

export type CreateTaskAttemptFormInputs = z.infer<
  typeof createTaskAttemptSchema
>;

export const createTaskAttemptDefaultValues: CreateTaskAttemptFormInputs = {
  answeredQuestionCount: 0,
  taskId: "",
  studentId: "",
  answerLogs: [
    {
      questionId: "",
      optionId: "",
      answerText: "",
      imageFile: null,
    },
  ],
};
