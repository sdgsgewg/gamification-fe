import { AttemptAnalyticsResponse } from "./IAttemptAnalyticsResponse";
import { StudentAttemptAnalyticsResponse } from "./IStudentAttemptAnalyticsResponse";

export interface TaskAttemptDetailAnalyticsResponse {
  task: {
    title: string;
    slug: string;
  };

  averageScoreAllStudents: number;
  totalAttempts: number;
  averageAttempts: number;

  attempts: AttemptAnalyticsResponse[];

  students: StudentAttemptAnalyticsResponse[];

  // CLASS SCOPE ONLY DATA
  class?: {
    name: string;
  };
}
