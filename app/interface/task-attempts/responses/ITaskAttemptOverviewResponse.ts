export interface ClassResponse {
  name: string;
  slug: string;
}

export interface TaskAttemptOverviewResponse {
  id: string;
  title: string;
  image: string;
  status: string;
  class: ClassResponse;
  taskSlug: string;
  deadline: string;
  lastAccessedTime: string;
  submittedTime?: string;
  completedTime?: string;
}
