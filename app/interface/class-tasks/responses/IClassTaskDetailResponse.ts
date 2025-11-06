import { TaskAttemptStatus } from "@/app/enums/TaskAttemptStatus";

export interface TaskType {
  id: string;
  name: string;
  isRepeatable: boolean;
}

export interface CurrentAttempt {
  answeredCount: number;
  startedAt: string;
  lastAccessedAt: string;
  status: TaskAttemptStatus;
}

export interface RecentAttempt {
  startedAt: string;
  lastAccessedAt: string;
  completedAt: string;
  status: TaskAttemptStatus;
}

export interface TaskDuration {
  startTime?: Date;
  endTime?: Date;
  duration?: string;
}

export interface ClassTaskDetailResponseDto {
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
  type: TaskType;
  currAttempt?: CurrentAttempt;
  recentAttempt?: RecentAttempt;
  duration?: TaskDuration;
}
