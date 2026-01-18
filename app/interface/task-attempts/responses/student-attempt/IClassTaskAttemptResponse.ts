import { BaseTaskAttempt } from "./IBaseTaskAttempt";

export class ClassTaskAttemptResponse extends BaseTaskAttempt {
  class!: {
    name: string;
    slug: string;
  };

  totalStudents!: number;

  deadline?: string;
}
