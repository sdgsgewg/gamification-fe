import { TaskAttemptStatus } from "@/app/enums/TaskAttemptStatus";

export interface CurrentAttemptResponse {
  answeredCount: number;
  startedAt: string;
  lastAccessedAt: string;
  status: TaskAttemptStatus;
}
