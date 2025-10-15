export interface ActivityOverviewResponse {
  id: string;
  title: string;
  slug: string;
  image?: string;
  type: string;
  subject: string;
  taskGrade: string;
  questionCount: number;
  answeredCount?: number;
}
