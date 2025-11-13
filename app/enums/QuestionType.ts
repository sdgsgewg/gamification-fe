export enum QuestionType {
  MULTIPLE_CHOICE = "multiple_choice",
  TRUE_FALSE = "true_false",
  FILL_BLANK = "fill_blank",
  ESSAY = "essay",
}

export const QuestionTypeLabels: Record<QuestionType, string> = {
  [QuestionType.MULTIPLE_CHOICE]: "Multiple Choice",
  [QuestionType.TRUE_FALSE]: "True/False",
  [QuestionType.FILL_BLANK]: "Fill in The Blanks",
  [QuestionType.ESSAY]: "Essay",
};
