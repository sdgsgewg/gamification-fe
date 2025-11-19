import { QuestionResponse } from "../../task-questions/responses/IQuestionResponse";

export interface ClassTaskWithQuestionsResponseDto {
  id: string;
  lastAttemptId?: string;
  startTime?: Date;
  endTime?: Date;
  duration?: string;
  questions: QuestionResponse[];
}
