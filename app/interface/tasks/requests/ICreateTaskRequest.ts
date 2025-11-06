import { RcFile } from "antd/es/upload";

export interface CreateTaskQuestionOptionRequest {
  text: string;
  isCorrect: boolean;
}

export interface CreateTaskQuestionRequest {
  text: string;
  point: number;
  type: string;
  timeLimit?: number;
  imageFile?: File | RcFile;
  options?: CreateTaskQuestionOptionRequest[];
  correctAnswer?: string | boolean;
}

export interface CreateTaskRequest {
  title: string;
  creatorId: string;
  subjectId: string;
  taskTypeId: string;
  gradeIds: string[];
  createdBy: string;
  difficulty: string;
  description?: string;
  materialId?: string | null;
  startTime?: Date | null;
  endTime?: Date | null;
  imageFile?: File | RcFile;
  questions: CreateTaskQuestionRequest[];
}
