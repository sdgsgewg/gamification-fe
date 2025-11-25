import { LeaderboardScope } from "@/app/types/LeaderboardScope";

export const scopeDescription: Record<LeaderboardScope, string> = {
  global:
    "This shows the total points accumulated from both activity and class tasks.",
  activity: "This shows points earned only from activities done outside class.",
  class:
    "This shows points collected from tasks submitted within class sessions.",
  student: "",
};
