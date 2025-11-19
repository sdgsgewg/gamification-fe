export interface UpsertTaskAttemptResponse {
  id: string;
  leveledUp: boolean;
  levelChangeSummary?: {
    previousLevel: number;
    newLevel: number;
    previousXp: number;
    newXp: number;
    levelsGained: number;
  } | null;
}
