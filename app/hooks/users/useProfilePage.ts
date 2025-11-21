// "use client";

// import { useState, useEffect, useMemo, useRef } from "react";
// import { useForm, Control } from "react-hook-form";
// import { useUserClasses } from "@/app/hooks/classes/useUserClasses";
// import { useGrades } from "@/app/hooks/grades/useGrades";
// import { FilterClassFormInputs } from "@/app/schemas/classes/filterClass";
// import { FormRef } from "@/app/interface/forms/IFormRef";
// import { ClassOverviewResponse } from "@/app/interface/classes/responses/IClassOverviewResponse";
// import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";

// export interface UseProfilePageResult {
//   // data
//   classes: ClassOverviewResponse[];
//   gradeData: GradeOverviewResponse[];
//   isClassLoading: boolean;
//   // refetch
//   refetchClasses: () => void;
// }

// export const useProfilePage = (): UseProfilePageResult => {
//   // ========================
//   // SEARCH
//   // ========================
//   const { control, watch } = useForm({
//     defaultValues: { searchText: "" },
//   });

//   const searchValue = watch("searchText");
//   const [debouncedSearch, setDebouncedSearch] = useState("");

//   useEffect(() => {
//     const handler = setTimeout(() => setDebouncedSearch(searchValue), 500);
//     return () => clearTimeout(handler);
//   }, [searchValue]);

//   // ========================
//   // FILTERS
//   // ========================
//   const [filters, setFilters] = useState<FilterClassFormInputs>({
//     searchText: "",
//   });

//   useEffect(() => {
//     setFilters((prev) => ({
//       ...prev,
//       searchText: debouncedSearch,
//     }));
//   }, [debouncedSearch]);

//   const filterFormRef = useRef<FormRef | null>(null);
//   const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

//   const openFilterModal = () => setIsFilterModalVisible(true);
//   const closeFilterModal = () => setIsFilterModalVisible(false);

//   const applyFilter = (values: FilterClassFormInputs) => {
//     setFilters((prev) => ({ ...prev, ...values }));
//     closeFilterModal();
//   };

//   // ========================
//   // FETCH CLASSES & GRADES
//   // ========================
//   const {
//     data: classes = [],
//     isLoading: isClassLoading,
//     refetch: refetchClasses,
//   } = useUserClasses(filters);

//   const { data: gradeData = [] } = useGrades();

//   useEffect(() => {
//     refetchClasses();
//   }, [filters, refetchClasses]);

//   // ========================
//   // PAGINATION
//   // ========================
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 8,
//   });

//   const paginatedClasses = useMemo(() => {
//     const startIdx = (pagination.current - 1) * pagination.pageSize;
//     const endIdx = pagination.current * pagination.pageSize;
//     return classes.slice(startIdx, endIdx);
//   }, [classes, pagination]);

//   return {
//     // data
//     classes,
//     gradeData,
//     isClassLoading,

//     // search
//     searchControl: control,
//     searchFormId: "search-class-form",

//     // filters
//     filters,
//     filterFormRef,
//     isFilterModalVisible,
//     openFilterModal,
//     closeFilterModal,
//     applyFilter,

//     // pagination
//     pagination,
//     setPagination,
//     paginatedClasses,

//     // refetch
//     refetchClasses,
//   };
// };
