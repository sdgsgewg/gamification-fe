import { CurrentAttemptResponse } from "../../task-attempts/responses/ICurrentAttemptResponse";
import { RecentAttemptRespons } from "../../task-attempts/responses/IRecentAttemptResponse";

export interface TaskDetail {
  title: string;
  slug: string;
  description?: string;
  image?: string;
  subject: { id: string; name: string };
  material?: { id: string; name: string };
  grade: string;
  questionCount: number;
  difficulty: string;
  createdBy: string;
  type: ActivityType;
}

export interface ActivityType {
  id: string;
  name: string;
  isRepeatable: boolean;
}

interface ActivityDuration {
  startTime?: Date;
  endTime?: Date;
  duration?: string;
}

export interface ActivityDetailResponse {
  id: string;
  taskDetail: TaskDetail;
  duration?: ActivityDuration;
  currAttempt?: CurrentAttemptResponse;
  recentAttempts?: RecentAttemptRespons[];
}
