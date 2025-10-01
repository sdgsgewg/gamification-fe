import { QuestionType } from "@/app/enums/QuestionType";
import z from "zod";

const optionSchema = z.object({
  optionId: z.string().optional(),
  text: z.string().nonempty("Opsi jawaban wajib diisi"),
  isCorrect: z.boolean(),
});

const questionSchema = z
  .object({
    questionId: z.string().optional(),
    text: z.string().nonempty("Pertanyaan wajib diisi"),
    point: z.number().min(0, "Poin minimal 0"),
    timeLimit: z.number().min(0, "Batas waktu minimal 0").optional().nullable(),
    type: z.union([
      z.enum([
        QuestionType.MULTIPLE_CHOICE,
        QuestionType.TRUE_FALSE,
        QuestionType.FILL_BLANK,
        QuestionType.ESSAY,
      ]),
      z.literal(""),
    ]),
    image: z.string().optional(),
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

export const editTaskQuestionSchema = z.object({
  questions: z.array(questionSchema).min(1, "Minimal ada satu pertanyaan"),
});

export type EditTaskQuestionFormInputs = z.infer<typeof editTaskQuestionSchema>;

export const editTaskQuestionDefaultValues: EditTaskQuestionFormInputs = {
  questions: [
    {
      text: "",
      point: 0,
      timeLimit: undefined,
      type: QuestionType.MULTIPLE_CHOICE,
      image: "",
      imageFile: null,
      options: [],
    },
  ],
};
