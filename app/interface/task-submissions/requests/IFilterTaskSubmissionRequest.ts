import { TaskSubmissionStatus } from "@/app/enums/TaskSubmissionStatus";

export interface FilterTaskSubmissionRequest {
  searchText?: string;
  status?: TaskSubmissionStatus | null;
  orderBy?: "createdAt" | "gradedAt" | "score";
  orderState?: "ASC" | "DESC";
}
