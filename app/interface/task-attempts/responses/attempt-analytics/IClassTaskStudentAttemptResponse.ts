import { BaseStudentAttempt } from "./IBaseStudentAttempt";

export class ClassTaskStudentAttemptResponse extends BaseStudentAttempt {
  class!: {
    name: string;
  };
}
