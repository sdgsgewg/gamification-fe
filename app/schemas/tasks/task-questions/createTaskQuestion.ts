import { QuestionType } from "@/app/enums/QuestionType";
import z from "zod";

const optionSchema = z.object({
  text: z.string().nonempty("Opsi jawaban wajib diisi"),
  isCorrect: z.boolean(),
});

const questionSchema = z
  .object({
    text: z.string().nonempty("Pertanyaan wajib diisi"),
    point: z.number().min(0, "Poin minimal 0"),
    timeLimit: z.number().min(0, "Batas waktu minimal 0").optional(),
    type: z.union([
      z.enum([
        QuestionType.MULTIPLE_CHOICE,
        QuestionType.TRUE_FALSE,
        QuestionType.FILL_BLANK,
        QuestionType.ESSAY,
      ]),
      z.literal(""),
    ]),
    imageFile: z.any().optional(),
    options: z.array(optionSchema).optional(),
    correctAnswer: z.union([z.string(), z.boolean()]).optional(),
  })
  .refine(
    (data) => {
      if (data.type === QuestionType.MULTIPLE_CHOICE) {
        return data.options && data.options.length >= 2;
      }
      return true;
    },
    { message: "Minimal 2 opsi untuk pilihan ganda", path: ["options"] }
  );

export const createTaskQuestionSchema = z.object({
  questions: z.array(questionSchema).min(1, "Minimal ada satu pertanyaan"),
});

export type CreateTaskQuestionFormInputs = z.infer<
  typeof createTaskQuestionSchema
>;

export const createTaskQuestionDefaultValues: CreateTaskQuestionFormInputs = {
  questions: [
    {
      text: "",
      point: 0,
      timeLimit: undefined,
      type: "",
      imageFile: null,
      options: [],
    },
  ],
};
