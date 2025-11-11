export interface ShareTaskIntoClassesRequest {
  taskId: string;
  classIds: string[];
  startTime?: Date;
  endTime?: Date;
}
