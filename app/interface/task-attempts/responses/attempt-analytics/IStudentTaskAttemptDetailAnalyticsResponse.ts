import { TaskAttemptStatus } from "@/app/enums/TaskAttemptStatus";
import { StudentAttemptDetailResponse } from "./IStudentAttemptDetailResponse";

export interface StudentTaskAttemptDetailAnalyticsResponse {
  studentId: string;
  studentName: string;

  task: {
    title: string;
    slug: string;
    totalQuestion: number;
    maxPoint: number;
  };

  // summary
  totalAttempts: number;
  firstAttemptScore?: number;
  lastAttemptScore?: number;
  averageScore?: number;
  improvement?: number;

  latestStatus: TaskAttemptStatus;
  latestSubmissionId?: string;

  // class only
  class?: {
    name: string;
    slug: string;
    deadline?: Date;
  };

  attempts: StudentAttemptDetailResponse[];
}
