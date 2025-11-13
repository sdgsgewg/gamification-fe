import { TaskAttemptStatus } from "@/app/enums/TaskAttemptStatus";

interface ActivityType {
  name: string;
  isRepeatable: boolean;
}

interface CurrentAttempt {
  answeredCount: number;
  startedAt: string;
  lastAccessedAt: string;
  status: TaskAttemptStatus;
}

interface RecentAttempt {
  startedAt: string;
  lastAccessedAt: string;
  completedAt: string;
  status: TaskAttemptStatus;
}

interface ActivityDuration {
  startTime?: Date;
  endTime?: Date;
  duration?: string;
}

export interface ActivityDetailResponse {
  id: string;
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
  currAttempt?: CurrentAttempt;
  recentAttempt?: RecentAttempt;
  duration?: ActivityDuration;
}
