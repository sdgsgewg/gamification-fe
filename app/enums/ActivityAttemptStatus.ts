export enum ActivityAttemptStatus {
  NOT_STARTED = "not_started",
  ON_PROGRESS = "on_progress",
  COMPLETED = "completed",
  PENDING = "pending",
}

export const ActivityAttemptStatusLabels: Record<
  ActivityAttemptStatus,
  string
> = {
  [ActivityAttemptStatus.NOT_STARTED]: "Belum Dimulai",
  [ActivityAttemptStatus.ON_PROGRESS]: "Sedang Dikerjakan",
  [ActivityAttemptStatus.COMPLETED]: "Selesai",
  [ActivityAttemptStatus.PENDING]: "Pending",
};
