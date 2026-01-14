import { CurrentAttemptResponse } from "../../task-attempts/responses/ICurrentAttemptResponse";
import { RecentAttemptRespons } from "../../task-attempts/responses/IRecentAttemptResponse";
import { BaseTaskType } from "../../task-types/responses/IBaseTaskType";
import { BaseTaskDetail } from "../../tasks/responses/IBaseTaskDetail";
import { TaskDuration } from "../../tasks/responses/ITaskDuration";

export interface ClassTaskDetail extends BaseTaskDetail {
  subtitle: string;
  type: BaseTaskType & {
    isRepeatable: boolean;
  };
}

export interface SubmissionSummary {
  pointGained: number;
  totalPoints: number;
  score: number;
  xpGained: number;
  feedback: string;
}

export interface ClassTaskDetailResponseDto {
  id: string;
  taskDetail: ClassTaskDetail;
  duration?: TaskDuration;
  currAttempt?: CurrentAttemptResponse;
  recentAttempts?: RecentAttemptRespons[];
}
