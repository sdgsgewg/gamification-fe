export interface ClassDetailResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  gradeIds: string[];
  grade: string;
  image?: string;
}
