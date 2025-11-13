export interface AssignedClassInfo {
  id: string;
  name: string;
  slug: string;
  submissionCount: number; // Jumlah siswa yang sudah submit
  totalStudents: number; // Jumlah total siswa di kelas
  gradedCount: number; // Jumlah submission yang sudah dinilai
  deadline?: string; // Tenggat waktu tugas
}

export interface TaskDuration {
  startTime?: Date;
  endTime?: Date;
  duration?: string;
}

export interface TaskHistory {
  createdBy: string;
  updatedBy?: string;
}

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
  assignedClasses?: AssignedClassInfo[];
  duration?: TaskDuration;
  history: TaskHistory;
  questions: TaskQuestionResponse[];
}
