export interface ClassResponse {
  id: string;
  name: string;
  slug: string;
}

export interface ClassTaskOverviewResponse {
  id: string;
  title: string;
  image: string;
  status: string;
  class: ClassResponse;
  taskSlug: string;
  deadline: string;
  lastAccessedTime?: string;
  submittedTime?: string;
  completedTime?: string;
}
