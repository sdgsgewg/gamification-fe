import { StudentTaskAttemptAnalyticsResponse } from "./IStudentTaskAttemptAnalyticsResponse";

export abstract class BaseStudentAttempt {
  task!: {
    title: string;
    slug: string;
  };

  averageScoreAllStudents!: number;
  averageAttempts!: number;

  students!: StudentTaskAttemptAnalyticsResponse[];
}
