export interface FilterTaskTypeRequest {
  searchText?: string;
  orderBy?: "createdAt" | "updatedAt" | "name";
  orderState?: "ASC" | "DESC";
}
