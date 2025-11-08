import z from "zod";

const answerLogSchema = z.object({
  answerLogId: z.string().nonempty("Id jawaban wajib diisi"),
  isCorrect: z.boolean().default(true),
  pointAwarded: z.number().nullable().optional(),
  teacherNotes: z.string().nullable().optional(),
});

export const updateTaskSubmissionSchema = z.object({
  status: z.string(),
  feedback: z.string().nullable().optional(),
  answers: z.array(answerLogSchema).min(1, "Minimal ada satu pertanyaan"),
});

export type UpdateTaskSubmissionFormInputs = z.infer<
  typeof updateTaskSubmissionSchema
>;

export const updateTaskSubmissionDefaultValues: UpdateTaskSubmissionFormInputs =
  {
    status: "",
    feedback: "",
    answers: [
      {
        answerLogId: "",
        isCorrect: true,
        pointAwarded: null,
        teacherNotes: "",
      },
    ],
  };
