export enum ActivitySectionType {
  CONTINUE = "continue",
  RECOMMENDED = "recommended",
  TOP = "top",
  LATEST = "latest",
}

export const ActivitySectionLabels: Record<ActivitySectionType, string> = {
  [ActivitySectionType.CONTINUE]: "Lanjut Mengerjakan",
  [ActivitySectionType.RECOMMENDED]: "Rekomendasi Untukmu",
  [ActivitySectionType.TOP]: "Top 10 Aktivitas",
  [ActivitySectionType.LATEST]: "Aktivitas Terbaru",
};
