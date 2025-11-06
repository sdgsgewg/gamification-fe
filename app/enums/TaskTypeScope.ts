export enum TaskTypeScope {
  ACTIVITY = "ACTIVITY",
  CLASS = "CLASS",
  GLOBAL = "GLOBAL",
}

export const TaskTypeScopeLabels: Record<TaskTypeScope, string> = {
  [TaskTypeScope.ACTIVITY]: "Activity",
  [TaskTypeScope.CLASS]: "Class",
  [TaskTypeScope.GLOBAL]: "Global",
};
