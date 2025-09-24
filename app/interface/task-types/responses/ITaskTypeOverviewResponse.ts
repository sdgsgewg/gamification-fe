export interface TaskTypeOverviewResponse {
  taskTypeId: string;
  name: string;
  slug: string;
  scope: string;
  hasDeadline: boolean;
  isCompetitive: boolean;
  isRepeatable: boolean;
  pointMultiplier: number;
  createdBy?: string;
  updatedBy?: string;
}
