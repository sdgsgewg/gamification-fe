import { CurrentAttemptResponse } from "../../task-attempts/responses/ICurrentAttemptResponse";
import { RecentAttemptRespons } from "../../task-attempts/responses/IRecentAttemptResponse";
import { BaseTaskType } from "../../task-types/responses/IBaseTaskType";
import { BaseTaskDetail } from "../../tasks/responses/IBaseTaskDetail";
import { TaskDuration } from "../../tasks/responses/ITaskDuration";

export interface ActivityTaskDetail extends BaseTaskDetail {
  type: BaseTaskType & {
    isRepeatable: boolean;
  };
}

export interface ActivityDetailResponse {
  id: string;
  taskDetail: ActivityTaskDetail;
  duration?: TaskDuration;
  currAttempt?: CurrentAttemptResponse;
  recentAttempts?: RecentAttemptRespons[];
}
