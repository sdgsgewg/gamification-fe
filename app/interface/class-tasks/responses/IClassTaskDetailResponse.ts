import { CurrentAttemptResponse } from "../../task-attempts/responses/ICurrentAttemptResponse";
import { RecentAttemptRespons } from "../../task-attempts/responses/IRecentAttemptResponse";

export interface TaskDetail {
  title: string;
  subtitle: string;
  slug: string;
  description?: string;
  image?: string;
  subject: { id: string; name: string };
  material?: { id: string; name: string };
  grade: string;
  questionCount: number;
  difficulty: string;
  createdBy: string;
  type: TaskType;
}

export interface TaskType {
  id: string;
  name: string;
  isRepeatable: boolean;
}

export interface SubmissionSummary {
  pointGained: number;
  totalPoints: number;
  score: number;
  xpGained: number;
  feedback: string;
}

export interface TaskDuration {
  startTime?: Date;
  endTime?: Date;
  duration?: string;
}

export interface ClassTaskDetailResponseDto {
  id: string;
  taskDetail: TaskDetail;
  duration?: TaskDuration;
  currAttempt?: CurrentAttemptResponse;
  recentAttempts?: RecentAttemptRespons[];
}
