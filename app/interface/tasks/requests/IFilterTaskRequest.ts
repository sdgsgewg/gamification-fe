export interface FilterTaskRequest {
  searchText?: string;
  subjectId?: string;
  materialId?: string;
  taskTypeId?: string;
  gradeIds?: string[];
  orderBy?: "createdAt" | "updatedAt" | "name";
  orderState?: "ASC" | "DESC";
}
