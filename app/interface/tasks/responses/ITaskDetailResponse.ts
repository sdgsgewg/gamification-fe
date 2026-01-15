import { TaskStatus } from "@/app/enums/TaskStatus";
import { TaskTypeScope } from "@/app/enums/TaskTypeScope";
import { BaseTaskDetail } from "./IBaseTaskDetail";
import { BaseTaskType } from "../../task-types/responses/IBaseTaskType";
import { TaskDuration } from "./ITaskDuration";

export interface TaskDetail extends BaseTaskDetail {
  type: BaseTaskType & {
    scope: TaskTypeScope;
  };
  gradeIds: string[];
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

export interface TaskHistory {
  createdBy: string;
  finalizedAt?: string;
  publishedAt?: string;
  archivedAt?: string;
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
