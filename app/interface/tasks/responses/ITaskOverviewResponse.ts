export interface TaskOverviewResponse {
  taskId: string;
  title: string;
  slug: string;
  taskType: string;
  subject: string;
  material?: string;
  taskGrade: string;
  questionCount: number;
  difficulty: string;
}
