export interface FilterClassRequest {
  searchText?: string;
  orderBy?: "createdAt" | "updatedAt" | "name";
  orderState?: "ASC" | "DESC";
}
