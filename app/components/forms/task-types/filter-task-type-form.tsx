"use client";

import { forwardRef, useImperativeHandle } from "react";
import { Form } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "../../fields/TextField";
import SelectField from "../../fields/SelectField";
import {
  filterTaskTypeDefaultValues,
  FilterTaskTypeFormInputs,
  filterTaskTypeSchema,
} from "@/app/schemas/task-types/filterTaskType";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { TaskTypeScope, TaskTypeScopeLabels } from "@/app/enums/TaskTypeScope";
import { BooleanField, BooleanFieldLabels } from "@/app/enums/BooleanField";
import NumberField from "../../fields/NumberField";

interface FilterTaskTypeFormProps {
  onFinish: (values: FilterTaskTypeFormInputs) => void;
}

const FilterTaskTypeForm = forwardRef<FormRef, FilterTaskTypeFormProps>(
  ({ onFinish }, ref) => {
    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<FilterTaskTypeFormInputs>({
      resolver: zodResolver(filterTaskTypeSchema),
      defaultValues: filterTaskTypeDefaultValues,
    });

    // Prepare options for select fields
    const scopeOptions = Object.values(TaskTypeScope).map((value) => ({
      value,
      label: TaskTypeScopeLabels[value],
    }));

    const booleanFieldOptions = Object.values(BooleanField).map((value) => ({
      value,
      label: BooleanFieldLabels[value],
    }));

    useImperativeHandle(ref, () => ({
      resetForm: () => reset(),
    }));

    return (
      <Form
        id="filter-task-type-form"
        name="filter-task-type"
        onFinish={handleSubmit(onFinish)}
        layout="vertical"
        className="flex flex-col gap-8"
      >
        <TextField
          control={control}
          name="name"
          label="Nama"
          placeholder="Masukkan nama tipe tugas"
          errors={errors}
        />

        <SelectField
          control={control}
          name="scope"
          label="Scope"
          placeholder="Pilih scope"
          options={scopeOptions}
          errors={errors}
          loading={scopeOptions.length === 0}
          disabled={scopeOptions.length === 0}
        />

        <SelectField
          control={control}
          name="hasDeadline"
          label="Has Deadline"
          placeholder="Pilih nilai"
          options={booleanFieldOptions}
          errors={errors}
          loading={booleanFieldOptions.length === 0}
          disabled={booleanFieldOptions.length === 0}
        />

        <SelectField
          control={control}
          name="isCompetitive"
          label="Is Competitive"
          placeholder="Pilih nilai"
          options={booleanFieldOptions}
          errors={errors}
          loading={booleanFieldOptions.length === 0}
          disabled={booleanFieldOptions.length === 0}
        />

        <SelectField
          control={control}
          name="isRepeatable"
          label="Is Repeatable"
          placeholder="Pilih nilai"
          options={booleanFieldOptions}
          errors={errors}
          loading={booleanFieldOptions.length === 0}
          disabled={booleanFieldOptions.length === 0}
        />

        <NumberField
          control={control}
          name="pointMultiplier"
          label="Point Multiplier"
          placeholder="Masukkan angka"
          errors={errors}
          min={0}
          step={1}
        />
      </Form>
    );
  }
);

FilterTaskTypeForm.displayName = "FilterTaskTypeForm";
export default FilterTaskTypeForm;
