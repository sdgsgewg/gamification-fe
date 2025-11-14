import { TaskAttemptStatus } from "@/app/enums/TaskAttemptStatus";
import { TaskAttemptOverviewResponse } from "@/app/interface/task-attempts/responses/ITaskAttemptOverviewResponse";
import {
  faCheck,
  faClock,
  faHourglassEnd,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

/* ---------------------------
   PROGRESS TEXT HELPER
---------------------------- */
export const getProgressText = (
  attempt: TaskAttemptOverviewResponse
): string => {
  if (attempt.completedTime) return `Graded on: ${attempt.completedTime}`;
  if (attempt.submittedTime) return `Submitted on: ${attempt.submittedTime}`;
  if (attempt.lastAccessedTime)
    return `Last accessed: ${attempt.lastAccessedTime}`;
  return "";
};

/* ---------------------------
   DEADLINE TEXT HELPER
---------------------------- */
export const getDeadlineText = (
  attempt: TaskAttemptOverviewResponse
): string => {
  const status = attempt.status as TaskAttemptStatus;

  if (
    status === TaskAttemptStatus.NOT_STARTED ||
    status === TaskAttemptStatus.ON_PROGRESS
  ) {
    return attempt.deadline;
  }

  return "";
};

/* ---------------------------
   STATUS → TAG COLOR
---------------------------- */
export const getStatusTagColor = (status: TaskAttemptStatus): string => {
  switch (status) {
    case TaskAttemptStatus.NOT_STARTED:
      return "default";
    case TaskAttemptStatus.ON_PROGRESS:
      return "blue";
    case TaskAttemptStatus.SUBMITTED:
      return "gold";
    case TaskAttemptStatus.COMPLETED:
      return "green";
    case TaskAttemptStatus.PAST_DUE:
      return "red";
    default:
      return "default";
  }
};

/* ---------------------------
   STATUS → ICON
---------------------------- */
export const getStatusIcon = (status: TaskAttemptStatus): IconDefinition => {
  switch (status) {
    case TaskAttemptStatus.NOT_STARTED:
      return faClock;
    case TaskAttemptStatus.ON_PROGRESS:
      return faSpinner;
    case TaskAttemptStatus.SUBMITTED:
      return faClock;
    case TaskAttemptStatus.COMPLETED:
      return faCheck;
    case TaskAttemptStatus.PAST_DUE:
      return faHourglassEnd;
    default:
      return faClock;
  }
};
