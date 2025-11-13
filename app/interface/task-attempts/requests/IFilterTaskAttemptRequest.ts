import { TaskAttemptStatus } from "@/app/enums/TaskAttemptStatus";

export interface FilterTaskAttemptRequest {
  searchText?: string;
  status?: TaskAttemptStatus | null;
  isClassTask?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  orderBy?: "startedAt" | "lastAccesedAt" | "completedAt" | "name";
  orderState?: "ASC" | "DESC";
}
