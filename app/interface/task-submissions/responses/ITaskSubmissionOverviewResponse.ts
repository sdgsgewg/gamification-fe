export interface TaskSubmissionOverviewResponse {
  id: string;
  title: string;
  image: string;
  className: string;
  studentName: string;
  status: string;
  classSlug?: string;
  taskSlug?: string;
  submittedTime: string;
  gradedTime?: string;
}
