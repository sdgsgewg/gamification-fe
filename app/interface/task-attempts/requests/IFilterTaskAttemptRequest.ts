import { ActivityAttemptStatus } from "@/app/enums/ActivityAttemptStatus";

export interface FilterTaskAttemptRequest {
  searchText?: string;
  status?: ActivityAttemptStatus | null;
  dateFrom?: Date;
  dateTo?: Date;
  orderBy?: "startedAt" | "lastAccesedAt" | "completedAt" | "name";
  orderState?: "ASC" | "DESC";
}
