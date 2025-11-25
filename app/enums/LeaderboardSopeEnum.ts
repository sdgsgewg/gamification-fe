export enum LeaderboardScopeEnum {
  GLOBAL = "GLOBAL",
  ACTIVITY = "ACTIVITY",
  CLASS = "CLASS",
  STUDENT = "STUDENT",
}

export const LeaderboardScopeEnumLabels: Record<LeaderboardScopeEnum, string> = {
  [LeaderboardScopeEnum.GLOBAL]: "Global",
  [LeaderboardScopeEnum.ACTIVITY]: "Activity",
  [LeaderboardScopeEnum.CLASS]: "Class",
  [LeaderboardScopeEnum.STUDENT]: "Student",
};
