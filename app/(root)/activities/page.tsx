"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FilterModal } from "@/app/components/modals/FilterModal";
import {
  filterActivityDefaultValues,
  FilterActivityFormInputs,
} from "@/app/schemas/activities/filterActivity";
import FilterActivityForm from "@/app/components/forms/activities/filter-activity-form";
import { useActivities } from "@/app/hooks/activities/useActivities";
import { useSubjects } from "@/app/hooks/subjects/useSubjects";
import { useMaterials } from "@/app/hooks/materials/useMaterials";
import { useTaskTypes } from "@/app/hooks/task-types/useTaskTypes";
import { useGrades } from "@/app/hooks/grades/useGrades";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { useGetCachedUser } from "@/app/hooks/useGetCachedUser";
import Loading from "@/app/components/shared/Loading";
import ActivityHeader from "@/app/components/pages/Activity/ActivityHeader";
import ActivitySection from "@/app/components/pages/Activity/ActivitySection";
import {
  ActivitySectionType,
  ActivitySectionLabels,
} from "@/app/enums/ActivitySectionType";

const ActivityPage = () => {
  const searchParams = useSearchParams();
  const { user } = useGetCachedUser();

  const [filters, setFilters] = useState<FilterActivityFormInputs>(
    filterActivityDefaultValues
  );
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const {
    data: continueActivities = [],
    isLoading: isContinueActivitiesLoading,
  } = useActivities({
    section: ActivitySectionType.CONTINUE,
    userId: user?.userId,
  });
  const {
    data: recommendedActivities = [],
    isLoading: isRecommendedActivitiesLoading,
  } = useActivities({
    section: ActivitySectionType.RECOMMENDED,
    userId: user?.userId,
  });
  const { data: topActivities = [], isLoading: isTopActivitiesLoading } =
    useActivities({
      section: ActivitySectionType.TOP,
    });
  const { data: latestActivities = [], isLoading: isLatestActivitiesLoading } =
    useActivities({
      section: ActivitySectionType.LATEST,
    });

  const {
    data: filteredActivities = [],
    isLoading: isFilteredActivitiesLoading,
  } = useActivities(filters);
  const { data: subjectData = [] } = useSubjects();
  const { data: materialData = [] } = useMaterials();
  const { data: taskTypeData = [] } = useTaskTypes();
  const { data: gradeData = [] } = useGrades();

  const headerFormRef = useRef<FormRef>(null);
  const modalFormRef = useRef<FormRef>(null);

  useEffect(() => {
    const subjectId = searchParams.get("subjectId");

    if (subjectId) {
      setFilters((prev) => ({
        ...prev,
        subjectId: subjectId,
      }));
    }
  }, [searchParams]);

  // Penanda apakah terdapat filter yang berubah atau tidak
  const isDefaultFilter = (filters: FilterActivityFormInputs) => {
    const defaultKeys = Object.keys(filterActivityDefaultValues);
    return defaultKeys.every((key) => {
      const value = filters[key as keyof FilterActivityFormInputs];
      const defaultValue =
        filterActivityDefaultValues[key as keyof FilterActivityFormInputs];
      // Cek untuk array
      if (Array.isArray(value) && Array.isArray(defaultValue)) {
        return value.length === defaultValue.length;
      }
      return value === defaultValue;
    });
  };

  // Penanda page default (tampil beberapa sections)
  const isDefault = isDefaultFilter(filters);

  const handleOpenFilter = () => setIsFilterModalVisible(true);
  const handleCloseFilter = () => setIsFilterModalVisible(false);

  const handleApplyFilter = (values: FilterActivityFormInputs) => {
    setFilters((prev) => ({
      ...prev,
      ...values, // gabungkan filter baru dengan search text
    }));
    setIsFilterModalVisible(false);
  };

  const handleResetFilters = () => {
    headerFormRef.current?.resetForm?.();
    modalFormRef.current?.resetForm?.();
    setFilters(filterActivityDefaultValues);
  };

  const isLoading =
    isContinueActivitiesLoading ||
    isRecommendedActivitiesLoading ||
    isTopActivitiesLoading ||
    isLatestActivitiesLoading ||
    isFilteredActivitiesLoading;

  return (
    <>
      {isLoading && <Loading />}

      <ActivityHeader
        formId="filter-activity-header-form"
        onResetFilters={handleResetFilters}
      >
        <FilterActivityForm
          formId="filter-activity-header-form"
          ref={headerFormRef}
          subjectData={subjectData}
          materialData={materialData}
          taskTypeData={taskTypeData}
          gradeData={gradeData}
          fromUI="activity-header"
          filterValue={filters}
          onOpenFilter={handleOpenFilter}
          onFinish={handleApplyFilter}
        />
      </ActivityHeader>

      <div className="w-full pt-12 pb-16 px-8 md:px-12 xl:px-20">
        {/* Tampilan awal (default categories) */}
        {isDefault && (
          <div className="flex flex-col gap-8 sm:gap-12 xl:gap-16 flex-1">
            <ActivitySection
              title={ActivitySectionLabels.continue}
              type={ActivitySectionType.CONTINUE}
              activities={continueActivities}
              showAnsweredCount
            />
            <ActivitySection
              title={ActivitySectionLabels.recommended}
              type={ActivitySectionType.RECOMMENDED}
              activities={recommendedActivities}
            />
            <ActivitySection
              title={ActivitySectionLabels.top}
              type={ActivitySectionType.TOP}
              activities={topActivities}
              showIndex
            />
            <ActivitySection
              title={ActivitySectionLabels.latest}
              type={ActivitySectionType.LATEST}
              activities={latestActivities}
              showNewBadge
            />
          </div>
        )}

        {/* Tampilan saat ada filter */}
        {!isDefault && (
          <div className="flex-1">
            {filteredActivities.length > 0 ? (
              <ActivitySection
                title="Hasil Pencarian"
                activities={filteredActivities}
              />
            ) : (
              <p className="text-center text-gray-500">
                Aktivitas tidak ditemukan.
              </p>
            )}
          </div>
        )}
      </div>

      <FilterModal
        visible={isFilterModalVisible}
        title="Filter Aktivitas"
        formId="filter-activity-modal-form"
        onCancel={handleCloseFilter}
        onResetFilters={handleResetFilters}
      >
        <FilterActivityForm
          formId="filter-activity-modal-form"
          ref={modalFormRef}
          subjectData={subjectData}
          materialData={materialData}
          taskTypeData={taskTypeData}
          gradeData={gradeData}
          fromUI="filter-modal"
          filterValue={filters}
          onOpenFilter={handleOpenFilter}
          onFinish={handleApplyFilter}
        />
      </FilterModal>
    </>
  );
};

export default ActivityPage;
