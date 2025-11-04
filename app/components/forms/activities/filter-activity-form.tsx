"use client";

import {
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { Form } from "antd";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "../../fields/TextField";
import SelectField from "../../fields/SelectField";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";
import { TaskTypeOverviewResponse } from "@/app/interface/task-types/responses/ITaskTypeOverviewResponse";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";
import { MaterialOverviewResponse } from "@/app/interface/materials/responses/IMaterialOverviewResponse";
import { FilterOutlined } from "@ant-design/icons";
import { useInitializeMaterialBasedOnSelectedSubject } from "@/app/hooks/form/useInitializeMaterialBasedOnSelectedSubject";
import { FormRef } from "@/app/interface/forms/IFormRef";
import {
  filterActivityDefaultValues,
  FilterActivityFormInputs,
  filterActivitySchema,
} from "@/app/schemas/activities/filterActivity";
import Button from "../../shared/Button";
import SearchField from "../../fields/SearchField";
import { useIsTablet } from "@/app/hooks/useIsTablet";
import { useIsDesktop } from "@/app/hooks/useIsDesktop";

type UIState = "activity-header" | "filter-modal";

interface FilterActivityFormProps {
  formId: string;
  subjectData: SubjectOverviewResponse[];
  materialData: MaterialOverviewResponse[];
  taskTypeData: TaskTypeOverviewResponse[];
  gradeData: GradeOverviewResponse[];
  fromUI: UIState;
  filterValue: FilterActivityFormInputs;
  onOpenFilter: () => void;
  onFinish: (values: FilterActivityFormInputs) => void;
}

const FilterActivityForm = forwardRef<FormRef, FilterActivityFormProps>(
  (
    {
      formId,
      subjectData,
      materialData,
      taskTypeData,
      gradeData,
      fromUI,
      filterValue,
      onOpenFilter,
      onFinish,
    },
    ref
  ) => {
    const { control, handleSubmit, resetField, reset } =
      useForm<FilterActivityFormInputs>({
        resolver: zodResolver(filterActivitySchema),
        defaultValues: filterValue ?? filterActivityDefaultValues,
      });

    useEffect(() => {
      if (filterValue) {
        reset(filterValue); // sync form values dengan filterValue dari parent
      }
    }, [filterValue, reset]);

    const selectedSubjectId = useWatch({ control, name: "subjectId" });
    const [filtertedMaterials, setFiltertedMaterials] = useState<
      MaterialOverviewResponse[]
    >([]);

    const subjectOptions = useMemo(
      () =>
        subjectData.map((subject) => ({
          value: subject.subjectId,
          label: subject.name,
        })),
      [subjectData]
    );

    const materialOptions = useMemo(
      () =>
        filtertedMaterials.map((material) => ({
          value: material.materialId,
          label: material.name,
        })),
      [filtertedMaterials]
    );

    const taskTypeOptions = useMemo(
      () =>
        taskTypeData.map((taskType) => ({
          value: taskType.taskTypeId,
          label: taskType.name,
        })),
      [taskTypeData]
    );

    const gradeOptions = useMemo(
      () =>
        gradeData.map((grade) => ({
          value: grade.gradeId,
          label: grade.name,
        })),
      [gradeData]
    );

    // Reset opsi material field berdasarkan subject yang dipilih
    useInitializeMaterialBasedOnSelectedSubject(
      selectedSubjectId,
      subjectData,
      materialData,
      resetField,
      setFiltertedMaterials
    );

    useImperativeHandle(ref, () => ({
      resetForm: () => reset(),
    }));

    const { isMediumTablet } = useIsTablet();
    const isDesktop = useIsDesktop();

    const ActivityHeaderView = () => {
      return (
        <div className="w-full grid grid-cols-1 xxs:flex xxs:items-center md:grid md:grid-cols-4 gap-y-2 xxs:gap-y-0 gap-x-4 sm:gap-x-8 md:gap-x-4 lg:gap-x-8">
          {(isMediumTablet || isDesktop) && (
            <>
              {/* Filter Mata Pelajaran */}
              <SelectField
                control={control}
                name="subjectId"
                placeholder="Mata pelajaran"
                options={subjectOptions}
                loading={subjectOptions.length === 0}
                disabled={subjectOptions.length === 0}
              />

              {/* Filter Tipe Aktivitas */}
              <SelectField
                control={control}
                name="taskTypeId"
                placeholder="Tipe Aktivitas"
                options={taskTypeOptions}
                loading={taskTypeOptions.length === 0}
                disabled={taskTypeOptions.length === 0}
              />

              {/* Filter Kelas */}
              <SelectField
                control={control}
                name="gradeIds"
                placeholder="Kelas"
                options={gradeOptions}
                loading={gradeOptions.length === 0}
                disabled={gradeOptions.length === 0}
                mode="multiple"
              />
            </>
          )}

          <div className="xxs:flex-1 ">
            <SearchField
              control={control}
              name="searchText"
              placeholder="Cari aktivitas..."
              formId="filter-activity-form"
            />
          </div>

          {!isMediumTablet && !isDesktop && (
            <Button
              icon={<FilterOutlined className="!text-dark" />}
              size="large"
              className="!bg-surface border !border-light-muted"
              onClick={onOpenFilter}
            >
              {""}
            </Button>
          )}
        </div>
      );
    };

    const FilterModalView = () => {
      return (
        <>
          <TextField
            control={control}
            name="searchText"
            label="Judul"
            placeholder="Cari aktivitas..."
          />

          <SelectField
            control={control}
            name="subjectId"
            label="Mata Pelajaran"
            placeholder="Mata pelajaran"
            options={subjectOptions}
            loading={subjectOptions.length === 0}
            disabled={subjectOptions.length === 0}
          />

          <SelectField
            control={control}
            name="materialId"
            label="Materi Pelajaran"
            placeholder="Materi pelajaran"
            options={materialOptions}
            disabled={materialOptions.length === 0}
            helpText={
              selectedSubjectId !== "" && materialOptions.length === 0
                ? "Belum ada materi yang tersedia untuk mata pelajaran ini."
                : undefined
            }
          />

          <SelectField
            control={control}
            name="taskTypeId"
            label="Tipe Aktivitas"
            placeholder="Tipe Aktivitas"
            options={taskTypeOptions}
            loading={taskTypeOptions.length === 0}
            disabled={taskTypeOptions.length === 0}
          />

          <SelectField
            control={control}
            name="gradeIds"
            label="Kelas"
            placeholder="Kelas"
            options={gradeOptions}
            loading={gradeOptions.length === 0}
            disabled={gradeOptions.length === 0}
            mode="multiple"
          />
        </>
      );
    };

    return (
      <Form
        id={formId}
        name={formId}
        onFinish={handleSubmit(onFinish)}
        layout={`${fromUI === "activity-header" ? "horizontal" : "vertical"}`}
        className={`${
          fromUI === "activity-header" ? "" : "flex flex-col gap-8"
        }`}
      >
        {fromUI === "activity-header" ? (
          <ActivityHeaderView />
        ) : fromUI === "filter-modal" ? (
          <FilterModalView />
        ) : (
          <></>
        )}
      </Form>
    );
  }
);

FilterActivityForm.displayName = "FilterActivityForm";
export default FilterActivityForm;
