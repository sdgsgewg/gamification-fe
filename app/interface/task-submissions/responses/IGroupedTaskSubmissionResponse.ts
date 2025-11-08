import { TaskSubmissionOverviewResponse } from "./ITaskSubmissionOverviewResponse";

export interface GroupedTaskSubmissionResponseDto {
  dateLabel: string;
  dayLabel: string;
  submissions: TaskSubmissionOverviewResponse[];
}
