export enum ActivitySectionType {
  CONTINUE = "continue",
  RECOMMENDED = "recommended",
  TOP = "top",
  LATEST = "latest",
}

export const ActivitySectionLabels: Record<ActivitySectionType, string> = {
  [ActivitySectionType.CONTINUE]: "Continue Attempt",
  [ActivitySectionType.RECOMMENDED]: "Recommended For You",
  [ActivitySectionType.TOP]: "Top 10 Activities",
  [ActivitySectionType.LATEST]: "Latest Activities",
};
