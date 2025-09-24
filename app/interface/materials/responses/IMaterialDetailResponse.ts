export interface MaterialDetailResponse {
  materialId: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  subject: { subjectId: string; name: string };
  materialGradeIds: string[];
  materialGrade: string;
  createdBy: string;
  updatedBy?: string;
}
