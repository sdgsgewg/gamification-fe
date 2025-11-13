import { TaskAttemptStatus } from "@/app/enums/TaskAttemptStatus";

export interface FilterClassTask {
  searchText?: string;
  status?: TaskAttemptStatus;
  orderBy?: "startedAt" | "lastAccesedAt" | "completedAt" | "name";
  orderState?: "ASC" | "DESC";
}
