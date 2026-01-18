import { StudentTaskAttemptAnalyticsResponse } from "../../task-attempts/responses/student-attempt/IStudentTaskAttemptAnalyticsResponse";

export interface ClassTaskAttemptAnalyticsResponse {
  className: string;
  taskTitle: string;
  taskSlug: string;

  averageScoreAllStudents: number;
  averageAttempts: number;

  students: StudentTaskAttemptAnalyticsResponse[];
}
