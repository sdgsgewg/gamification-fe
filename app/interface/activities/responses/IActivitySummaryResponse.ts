import { QuestionResponse } from "../../task-questions/responses/IQuestionResponse";

export interface ActivityStats {
  pointGained: number;
  totalPoints: number;
  score: number;
  xpGained: number;
}

export interface ActivityProgress {
  startedAt: string;
  completedAt: string;
  duration: string;
  status: string;
}

export interface ActivitySummaryResponse {
  title: string;
  image: string;
  description: string;
  stats: ActivityStats;
  progress: ActivityProgress;
  questions: QuestionResponse[];
}
