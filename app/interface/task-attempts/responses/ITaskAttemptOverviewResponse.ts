export interface TaskAttemptOverviewResponse {
  id: string;
  title: string;
  image: string;
  status: string;
  lastAccessedTime: string;
  completedTime?: string;
}
