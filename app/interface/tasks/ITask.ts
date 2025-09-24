export interface Task {
  taskId: string;
  title: string;
  slug: string;
  description: string;
  subject?: { subjectId: string; name: string };
  material?: { materialId: string; name: string };
  taskType: { taskTypeId: string; name: string };
  taskGradeIds?: string[];
  taskGrade?: string;
  startTime?: string;
  endTime?: string;
  image: string;
  createdAt?: string;
  createdBy?: string;
  updatedtAt?: string;
  updatedBy?: string;
  questionCount: number;
}

// Untuk default value edit page
export interface EditTaskDefaultValue {
  taskId: string;
  title: string;
  slug: string;
  description: string;
  subject: { subjectId: string; name: string };
  material: { materialId: string; name: string };
  taskType: { taskTypeId: string; name: string };
  taskGradeIds: string[];
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  image: string;
}
