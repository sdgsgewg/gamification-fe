import { TaskAttemptOverviewResponse } from "./ITaskAttemptOverviewResponse";

export interface GroupedTaskAttemptResponseDto {
  dateLabel: string;
  dayLabel: string;
  attempts: TaskAttemptOverviewResponse[];
}
