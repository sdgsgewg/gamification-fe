import { TaskAttemptStatus } from "@/app/enums/TaskAttemptStatus";
import { StudentAttemptDetailResponse } from "./IStudentAttemptDetailResponse";

export interface StudentTaskAttemptAnalyticsResponse {
  studentId: string;
  studentName: string;

  totalAttempts: number;
  firstAttemptScore?: number;
  lastAttemptScore?: number;
  averageScore?: number;
  improvement?: number;

  latestStatus: TaskAttemptStatus;
  latestSubmissionId: string;

  attempts: StudentAttemptDetailResponse[];
}
