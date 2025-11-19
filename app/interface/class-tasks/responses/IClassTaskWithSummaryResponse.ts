import { QuestionResponse } from "../../task-questions/responses/IQuestionResponse";

export interface ClassTaskStats {
  pointGained: number;
  totalPoints: number;
  score: number;
  xpGained: number;
}

export interface ClassTaskAttemptProgress {
  startedAt: string;
  submittedAt: string;
  duration: string;
  status: string;
}

export interface ClassTaskGradingProgress {
  startGradedAt: string;
  lastGradedAt: string;
  finishGradedAt: string;
  duration: string;
  status: string;
}

export interface ClassTaskSummaryResponseDto {
  title: string;
  image: string;
  description: string;
  teacherName: string;
  className: string;
  stats: ClassTaskStats;
  attemptProgress: ClassTaskAttemptProgress;
  gradingProgress: ClassTaskGradingProgress;
  questions: QuestionResponse[];
}
