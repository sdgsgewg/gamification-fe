import { TaskAttemptStatus } from "@/app/enums/TaskAttemptStatus";

export interface StudentAttemptDetailDto {
  attemptNumber: number;
  attemptId: string;
  score: number;
  status: TaskAttemptStatus;
  completedAt?: Date;
}

export interface StudentTaskAttemptAnalyticsDto {
  studentId: string;
  studentName: string;

  totalAttempts: number;
  firstAttemptScore?: number;
  lastAttemptScore?: number;
  averageScore?: number;
  improvement?: number;

  latestStatus: TaskAttemptStatus;
  latestSubmissionId: string;

  attempts: StudentAttemptDetailDto[];
}

export interface ClassTaskAttemptAnalyticsResponseDto {
  className: string;
  taskTitle: string;
  taskSlug: string;

  averageScoreAllStudents: number;
  averageAttempts: number;

  students: StudentTaskAttemptAnalyticsDto[];
}
