"use client";

import { useMemo, forwardRef, useImperativeHandle } from "react";
import { Form } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "../../fields/TextField";
import SelectField from "../../fields/SelectField";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";
import {
  filterClassDefaultValues,
  FilterClassFormInputs,
  filterClassSchema,
} from "@/app/schemas/classes/filterClass";
import { FormRef } from "@/app/interface/forms/IFormRef";

interface FilterClassFormProps {
  gradeData: GradeOverviewResponse[];
  onFinish: (values: FilterClassFormInputs) => void;
}

const FilterClassForm = forwardRef<FormRef, FilterClassFormProps>(
  ({ gradeData, onFinish }, ref) => {
    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<FilterClassFormInputs>({
      resolver: zodResolver(filterClassSchema),
      defaultValues: filterClassDefaultValues,
    });

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
        id="filter-class-form"
        name="filter-class"
        onFinish={handleSubmit(onFinish)}
        layout="vertical"
        className="flex flex-col gap-8"
      >
        <TextField
          control={control}
          name="searchText"
          label="Nama"
          placeholder="Enter class name"
          errors={errors}
        />

        <SelectField
          control={control}
          name="gradeIds"
          label="Grade Levels"
          placeholder="Select Grade Levels"
          options={gradeOptions}
          loading={gradeOptions.length === 0}
          disabled={gradeOptions.length === 0}
          mode="multiple"
        />
      </Form>
    );
  }
);

FilterClassForm.displayName = "FilterClassForm";
export default FilterClassForm;
