import { TaskAttemptStatus } from "@/app/enums/TaskAttemptStatus";

export interface StudentClassTaskResponse {
  title: string;
  slug: string;
  image?: string;
  type: string;
  subject: string;
  questionCount: number;
  answeredCount: number;
  deadline?: string;
  status: TaskAttemptStatus;
}
