import { RcFile } from "antd/es/upload";

export interface UpdateTaskQuestionOptionRequest {
  optionId: string;
  text: string;
  isCorrect: boolean;
}

export interface UpdateTaskQuestionRequest {
  questionId: string;
  text: string;
  point: number;
  type: string;
  timeLimit?: number | null;
  imageFile?: File | RcFile;
  options?: UpdateTaskQuestionOptionRequest[];
  correctAnswer?: string | boolean;
}

export interface UpdateTaskRequest {
  title: string;
  subjectId: string;
  taskTypeId: string;
  gradeIds: string[];
  updatedBy: string;
  difficulty: string;
  description?: string | null;
  materialId?: string;
  startTime?: Date;
  endTime?: Date;
  imageFile?: File | RcFile;
  questions: UpdateTaskQuestionRequest[];
}
