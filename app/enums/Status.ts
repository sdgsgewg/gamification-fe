export enum Status {
  NOT_STARTED = "not_started",
  ON_PROGRESS = "on_progress",
  COMPLETED = "completed",
}

export const StatusLabels: Record<Status, string> = {
  [Status.NOT_STARTED]: "Belum Dimulai",
  [Status.ON_PROGRESS]: "Sedang Dikerjakan",
  [Status.COMPLETED]: "Selesai",
};
