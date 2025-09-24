export interface FilterSubjectRequest {
  searchText?: string;
  orderBy?: "createdAt" | "updatedAt" | "name";
  orderState?: "ASC" | "DESC";
}
