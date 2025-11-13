"use client";

import { useMemo, useState, forwardRef, useImperativeHandle } from "react";
import { Form } from "antd";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "../../fields/TextField";
import SelectField from "../../fields/SelectField";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";
import { TaskTypeOverviewResponse } from "@/app/interface/task-types/responses/ITaskTypeOverviewResponse";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";
import { MaterialOverviewResponse } from "@/app/interface/materials/responses/IMaterialOverviewResponse";
import {
  filterTaskDefaultValues,
  FilterTaskFormInputs,
  filterTaskSchema,
} from "@/app/schemas/tasks/filterTask";
import { useInitializeMaterialBasedOnSelectedSubject } from "@/app/hooks/form/useInitializeMaterialBasedOnSelectedSubject";
import { FormRef } from "@/app/interface/forms/IFormRef";

interface FilterTaskFormProps {
  subjectData: SubjectOverviewResponse[];
  materialData: MaterialOverviewResponse[];
  taskTypeData: TaskTypeOverviewResponse[];
  gradeData: GradeOverviewResponse[];
  onFinish: (values: FilterTaskFormInputs) => void;
}

const FilterTaskForm = forwardRef<FormRef, FilterTaskFormProps>(
  ({ subjectData, materialData, taskTypeData, gradeData, onFinish }, ref) => {
    const {
      control,
      handleSubmit,
      formState: { errors },
      resetField,
      reset,
    } = useForm<FilterTaskFormInputs>({
      resolver: zodResolver(filterTaskSchema),
      defaultValues: filterTaskDefaultValues,
    });

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

    return (
      <Form
        id="filter-task-form"
        name="filter-task"
        onFinish={handleSubmit(onFinish)}
        layout="vertical"
        className="flex flex-col gap-8"
      >
        <TextField
          control={control}
          name="searchText"
          label="Judul"
          placeholder="Masukkan judul tugas"
          errors={errors}
        />

        <SelectField
          control={control}
          name="subjectId"
          label="Mata Pelajaran"
          placeholder="Pilih mata pelajaran"
          options={subjectOptions}
          errors={errors}
          loading={subjectOptions.length === 0}
          disabled={subjectOptions.length === 0}
        />

        <SelectField
          control={control}
          name="materialId"
          label="Materi Pelajaran"
          placeholder="Pilih materi pelajaran"
          options={materialOptions}
          errors={errors}
          disabled={materialOptions.length === 0}
        />

        <SelectField
          control={control}
          name="taskTypeId"
          label="Tipe Tugas"
          placeholder="Pilih tipe tugas"
          options={taskTypeOptions}
          errors={errors}
          loading={taskTypeOptions.length === 0}
          disabled={taskTypeOptions.length === 0}
        />

        <SelectField
          control={control}
          name="gradeIds"
          label="Tingkat Kelas"
          placeholder="Pilih tingkat kelas"
          options={gradeOptions}
          loading={gradeOptions.length === 0}
          disabled={gradeOptions.length === 0}
          mode="multiple"
        />
      </Form>
    );
  }
);

FilterTaskForm.displayName = "FilterTaskForm";
export default FilterTaskForm;
