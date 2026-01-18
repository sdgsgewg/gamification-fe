import { StudentTaskAttemptAnalyticsResponse } from "./IStudentTaskAttemptAnalyticsResponse";

export interface StudentAttemptResponse {
  task: {
    title: string;
    slug: string;
  };

  averageScoreAllStudents: number;
  averageAttempts: number;

  students: StudentTaskAttemptAnalyticsResponse[];
}
