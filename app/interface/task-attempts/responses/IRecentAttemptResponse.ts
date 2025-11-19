import { TaskAttemptStatus } from "@/app/enums/TaskAttemptStatus";

export interface RecentAttemptRespons {
  id: string;
  startedAt: string;
  submittedAt: string;
  completedAt: string;
  duration: string;
  status: TaskAttemptStatus;
}
