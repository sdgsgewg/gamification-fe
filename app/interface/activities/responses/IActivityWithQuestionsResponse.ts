import { QuestionResponse } from "../../task-questions/responses/IQuestionResponse";

export interface ActivityWithQuestionsResponse {
  id: string;
  lastAttemptId?: string;
  startTime?: Date;
  endTime?: Date;
  duration?: string;
  questions: QuestionResponse[];
}
