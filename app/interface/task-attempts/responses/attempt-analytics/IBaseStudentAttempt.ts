import { StudentTaskAttemptAnalyticsResponse } from "./IStudentTaskAttemptAnalyticsResponse";
import { TaskAttemptAnalyticsResponse } from "./ITaskAttemptAnalyticsResponse";

export abstract class BaseStudentAttempt {
  task!: {
    title: string;
    slug: string;
  };

  averageScoreAllStudents!: number;
  averageAttempts!: number;

  attempts!: TaskAttemptAnalyticsResponse[];

  students!: StudentTaskAttemptAnalyticsResponse[];
}
