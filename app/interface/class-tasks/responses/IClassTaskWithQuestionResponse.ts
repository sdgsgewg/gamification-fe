import { QuestionResponse } from "../../task-questions/responses/IQuestionResponse";

export interface ClassTaskWithQuestionsResponse {
  id: string;
  classId: string;
  taskId: string;
  lastAttemptId?: string;
  startTime?: Date;
  endTime?: Date;
  duration?: string;
  questions: QuestionResponse[];
}
