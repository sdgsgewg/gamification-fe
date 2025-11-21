import { TaskAttemptOverviewResponse } from "./ITaskAttemptOverviewResponse";

export interface GroupedTaskAttemptResponse {
  dateLabel: string;
  dayLabel: string;
  attempts: TaskAttemptOverviewResponse[];
}
