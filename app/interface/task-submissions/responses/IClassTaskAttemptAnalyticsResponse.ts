import { StudentTaskAttemptAnalyticsResponse } from "../../task-attempts/responses/attempt-analytics/IStudentAttemptAnalyticsResponse";

export interface ClassTaskAttemptAnalyticsResponse {
  className: string;
  taskTitle: string;
  taskSlug: string;

  averageScoreAllStudents: number;
  averageAttempts: number;

  students: StudentTaskAttemptAnalyticsResponse[];
}
