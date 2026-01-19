import z from "zod";

const answerLogSchema = z.object({
  // UPDATE ONLY
  answerLogId: z.string().nullable().optional(),

  // INSERT & UPDATE
  questionId: z.string().nonempty("Id pertanyaan wajib diisi"),
  optionId: z.string().nullable(),
  answerText: z.string().nullable(),
  imageFile: z.any().optional(),
});

export const upsertTaskAttemptSchema = z.object({
  // INSERT & UPDATE
  answeredQuestionCount: z.number(),
  startedAt: z.date().optional().nullable(),
  lastAccessedAt: z.date(),
  answerLogs: z.array(answerLogSchema).min(1, "Minimal ada satu pertanyaan"),

  // INSERT ONLY
  taskId: z.string(),
  studentId: z.string(),
  classId: z.string().optional().nullable(),
});

export type UpsertTaskAttemptFormInputs = z.infer<
  typeof upsertTaskAttemptSchema
>;

export const upsertTaskAttemptDefaultValues: UpsertTaskAttemptFormInputs = {
  answeredQuestionCount: 0,
  startedAt: new Date(),
  lastAccessedAt: new Date(),
  taskId: "",
  studentId: "",
  classId: null,
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
