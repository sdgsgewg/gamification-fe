export interface FormRef<T = unknown> {
  values?: Partial<T>; // pakai Partial biar semua field boleh undefined
  isDirty?: boolean;
  resetForm?: () => void;
}
