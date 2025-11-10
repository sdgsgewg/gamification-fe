import { QuestionType } from "@/app/enums/QuestionType";

export function getDefaultOptionsByType(type: QuestionType) {
  switch (type) {
    case QuestionType.TRUE_FALSE:
      return [
        { text: "True", isCorrect: false },
        { text: "False", isCorrect: false },
      ];
    case QuestionType.FILL_BLANK:
      return [{ text: "", isCorrect: true }];
    case QuestionType.MULTIPLE_CHOICE:
      return [
        { text: "Option 1", isCorrect: false },
        { text: "Option 2", isCorrect: false },
        { text: "Option 3", isCorrect: false },
        { text: "Option 4", isCorrect: false },
      ];
    default:
      return [];
  }
}
