export interface FilterUserRequest {
  searchText?: string;
  role?: string;
  gradeId?: string;
  orderBy?: "createdAt" | "name";
  orderState?: "ASC" | "DESC";
}
