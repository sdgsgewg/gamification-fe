import { ActivityAttemptStatus } from "@/app/enums/ActivityAttemptStatus";

export interface ActivityAttempt {
  answeredCount?: number;
  startedAt?: string | null;
  lastAccessedAt?: string | null;
  status?: ActivityAttemptStatus;
}

export interface ActivityDetailResponse {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  subject: { subjectId: string; name: string };
  material?: { materialId: string; name: string };
  type: { taskTypeId: string; name: string };
  grade: string;
  questionCount: number;
  startTime?: Date;
  endTime?: Date;
  duration?: string;
  createdBy: string;
  attempt?: ActivityAttempt;
}
