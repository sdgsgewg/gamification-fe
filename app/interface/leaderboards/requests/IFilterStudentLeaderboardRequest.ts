import { LeaderboardScope } from "@/app/enums/LeaderboardSopeEnum";

export interface FilterStudentLeaderboardRequest {
  scope?: LeaderboardScope;
  orderBy?: "name";
  orderState?: "ASC" | "DESC";
}
