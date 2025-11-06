export interface TaskQuestionOptionResponse {
  optionId: string;
  text: string;
  isCorrect: boolean;
}

export interface TaskQuestionResponse {
  questionId: string;
  text: string;
  point: number;
  type: string;
  timeLimit?: number;
  image?: string;
  options?: TaskQuestionOptionResponse[];
}

export interface TaskDetailResponse {
  taskId: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  subject: { subjectId: string; name: string };
  material?: { materialId: string; name: string };
  taskType: { taskTypeId: string; name: string };
  taskGradeIds: string[];
  taskGrade: string;
  questionCount: number;
  difficulty: string;
  startTime?: Date | null;
  endTime?: Date | null;
  duration?: string;
  createdBy: string;
  updatedBy?: string;
  questions: TaskQuestionResponse[];
}
