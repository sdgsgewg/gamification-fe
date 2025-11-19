import { AnswerLogResponse } from "../../task-answer-logs/responses/IAnswerLogResponse";
import { QuestionOptionResponse } from "../../task-question-options/responses/IQuestionOptionResponse";

export interface QuestionResponse {
  questionId: string;
  text: string;
  point: number;
  type: string;
  timeLimit?: number;
  image?: string;
  options?: QuestionOptionResponse[];
  userAnswer?: AnswerLogResponse;
}
