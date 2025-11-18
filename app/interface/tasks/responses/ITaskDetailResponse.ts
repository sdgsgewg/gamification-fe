import { TaskStatus } from "@/app/enums/TaskStatus";
import { TaskTypeScope } from "@/app/enums/TaskTypeScope";

export interface TaskType {
  id: string;
  name: string;
  scope: TaskTypeScope;
}

export interface TaskDetail {
  title: string;
  slug: string;
  description?: string;
  image?: string;
  subject: { subjectId: string; name: string };
  material?: { materialId: string; name: string };
  taskType: TaskType;
  taskGradeIds: string[];
  taskGrade: string;
  questionCount: number;
  difficulty: string;
  status: TaskStatus;
}

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
  publishedAt?: string;
  finalizedAt?: string;
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
  id: string;
  taskDetail: TaskDetail;
  assignedClasses?: AssignedClassInfo[];
  duration?: TaskDuration;
  history: TaskHistory;
  questions: TaskQuestionResponse[];
}
