import { TaskAttemptScope } from "@/app/enums/TaskAttemptScope";

export interface FilterTaskAttemptAnalyticsRequest {
  searchText?: string;
  scope?: TaskAttemptScope;
}
