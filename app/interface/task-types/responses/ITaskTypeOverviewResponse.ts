export interface TaskTypeOverviewResponse {
  taskTypeId: string;
  name: string;
  slug: string;
  scope: string;
  hasDeadline: boolean;
  isRepeatable: boolean;
  createdBy?: string;
  updatedBy?: string;
}
