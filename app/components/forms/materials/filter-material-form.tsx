"use client";

import { useMemo, forwardRef, useImperativeHandle } from "react";
import { Form } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "../../fields/TextField";
import SelectField from "../../fields/SelectField";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";
import {
  filterMaterialDefaultValues,
  FilterMaterialFormInputs,
  filterMaterialSchema,
} from "@/app/schemas/materials/filterMaterial";
import { FormRef } from "@/app/interface/forms/IFormRef";

interface FilterMaterialFormProps {
  subjectData: SubjectOverviewResponse[];
  gradeData: GradeOverviewResponse[];
  onFinish: (values: FilterMaterialFormInputs) => void;
}

const FilterMaterialForm = forwardRef<FormRef, FilterMaterialFormProps>(
  ({ subjectData, gradeData, onFinish }, ref) => {
    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<FilterMaterialFormInputs>({
      resolver: zodResolver(filterMaterialSchema),
      defaultValues: filterMaterialDefaultValues,
    });

    const subjectOptions = useMemo(
      () =>
        subjectData.map((subject) => ({
          value: subject.subjectId,
          label: subject.name,
        })),
      [subjectData]
    );

    const gradeOptions = useMemo(
      () =>
        gradeData.map((grade) => ({
          value: grade.gradeId,
          label: grade.name,
        })),
      [gradeData]
    );

    useImperativeHandle(ref, () => ({
      resetForm: () => reset(),
    }));

    return (
      <Form
        id="filter-material-form"
        name="filter-material"
        onFinish={handleSubmit(onFinish)}
        layout="vertical"
        className="flex flex-col gap-8"
      >
        <TextField
          control={control}
          name="searchText"
          label="Nama"
          placeholder="Masukkan nama materi pelajaran"
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

FilterMaterialForm.displayName = "FilterMaterialForm";
export default FilterMaterialForm;
