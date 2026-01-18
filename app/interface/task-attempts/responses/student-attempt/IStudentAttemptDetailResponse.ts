import { TaskAttemptStatus } from "@/app/enums/TaskAttemptStatus";

export interface StudentAttemptDetailResponse {
  attemptNumber: number;
  attemptId: string;
  score: number;
  status: TaskAttemptStatus;
  completedAt?: Date;
}
