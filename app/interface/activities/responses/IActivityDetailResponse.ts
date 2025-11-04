import { ActivityAttemptStatus } from "@/app/enums/ActivityAttemptStatus";

interface ActivityType {
  name: string;
  isRepeatable: boolean;
}

interface CurrentAttempt {
  answeredCount: number;
  startedAt: string;
  lastAccessedAt: string;
  status: ActivityAttemptStatus;
}

interface RecentAttempt {
  startedAt: string;
  lastAccessedAt: string;
  completedAt: string;
  status: ActivityAttemptStatus;
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
  createdBy: string;
  type: ActivityType;
  currAttempt?: CurrentAttempt;
  recentAttempt?: RecentAttempt;
  duration?: ActivityDuration;
}
