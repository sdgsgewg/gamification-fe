import z from "zod";

const answerLogSchema = z.object({
  questionId: z.string().nonempty("Id pertanyaan wajib diisi"),
  optionId: z.string().nullable(),
  answerText: z.string().nullable(),
  imageFile: z.any().optional(),
});

export const createTaskAttemptSchema = z.object({
  answeredQuestionCount: z.number(),
  status: z.string(),
  startedAt: z.date(),
  lastAccessedAt: z.date(),
  taskId: z.string(),
  studentId: z.string(),
  classId: z.string().optional().nullable(),
  answerLogs: z.array(answerLogSchema).min(1, "Minimal ada satu pertanyaan"),
});

export type CreateTaskAttemptFormInputs = z.infer<
  typeof createTaskAttemptSchema
>;

export const createTaskAttemptDefaultValues: CreateTaskAttemptFormInputs = {
  answeredQuestionCount: 0,
  status: "",
  startedAt: new Date(),
  lastAccessedAt: new Date(),
  taskId: "",
  studentId: "",
  classId: null,
  answerLogs: [
    {
      questionId: "",
      optionId: "",
      answerText: "",
      imageFile: null,
    },
  ],
};
