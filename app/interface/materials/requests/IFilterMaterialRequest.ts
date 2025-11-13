export interface FilterMaterialRequest {
  searchText?: string;
  subjectId?: string;
  gradeIds?: string[];
  orderBy?: "createdAt" | "updatedAt" | "name";
  orderState?: "ASC" | "DESC";
}
