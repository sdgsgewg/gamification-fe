export enum TaskTypeScope {
  GLOBAL = "global",
  CLASS = "class",
  BOTH = "both",
}

export const TaskTypeScopeLabels: Record<TaskTypeScope, string> = {
  [TaskTypeScope.GLOBAL]: "Global",
  [TaskTypeScope.CLASS]: "Class",
  [TaskTypeScope.BOTH]: "Both",
};
