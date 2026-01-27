import { TaskAttemptStatus } from "@/app/enums/TaskAttemptStatus";

export interface StudentAttemptDetailResponse {
  attemptNumber: number;
  attemptId: string;

  class?: {
    name: string;
    slug: string;
  };

  task: {
    slug: string;
  };

  scope: string;
  score: number;
  status: TaskAttemptStatus;
  completedAt?: Date;
}
