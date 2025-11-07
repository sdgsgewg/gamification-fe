export interface TaskAttemptOverviewResponse {
  id: string;
  title: string;
  image: string;
  status: string;
  classSlug: string;
  taskSlug: string;
  lastAccessedTime: string;
  submittedTime?: string;
  completedTime?: string;
}
