"use client";

import { Form } from "antd";
import { useToast } from "@/app/hooks/use-toast";
import { useForm, useWatch } from "react-hook-form";
import {
  createTaskTypeDefaultValues,
  CreateTaskTypeFormInputs,
  createTaskTypeSchema,
} from "@/app/schemas/task-types/createTaskType";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../shared/Button";
import { forwardRef, useImperativeHandle, useState } from "react";
import TextField from "../../fields/TextField";
import TextAreaField from "../../fields/TextAreaField";
import FormLayout from "@/app/dashboard/form-layout";
import Loading from "../../shared/Loading";
import SelectField from "../../fields/SelectField";
import { taskTypeProvider } from "@/app/functions/TaskTypeProvider";
import NumberField from "../../fields/NumberField";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { useDirtyCheck, useInjectUser } from "@/app/utils/form";
import { TaskTypeScope, TaskTypeScopeLabels } from "@/app/enums/TaskTypeScope";
import { BooleanField, BooleanFieldLabels } from "@/app/enums/BooleanField";

interface CreateTaskTypeFormProps {
  onFinish: (values: CreateTaskTypeFormInputs) => void;
}

const CreateTaskTypeForm = forwardRef<FormRef, CreateTaskTypeFormProps>(
  ({ onFinish }, ref) => {
    const { toast } = useToast();

    const {
      control,
      handleSubmit,
      formState: { errors },
      setValue,
    } = useForm<CreateTaskTypeFormInputs>({
      resolver: zodResolver(createTaskTypeSchema),
      defaultValues: createTaskTypeDefaultValues,
    });

    const watchedValues = useWatch({ control });
    const [isLoading, setIsLoading] = useState(false);

    // Prepare options for select fields
    const scopeOptions = Object.values(TaskTypeScope).map((value) => ({
      value,
      label: TaskTypeScopeLabels[value],
    }));

    const booleanFieldOptions = Object.values(BooleanField).map((value) => ({
      value,
      label: BooleanFieldLabels[value],
    }));

    useInjectUser(setValue, ["createdBy"]);
    const isDirty = useDirtyCheck(watchedValues, ["createdBy"]);

    const onSubmit = async (data: CreateTaskTypeFormInputs) => {
      setIsLoading(true);

      const result = await taskTypeProvider.createTaskType(data);

      const { isSuccess, message } = result;

      if (isSuccess) {
        toast.success(message ?? "Tipe tugas berhasil dibuat!");
        onFinish(data);
      } else {
        toast.error(message ?? "Pembuatan tipe tugas gagal.");
      }

      setIsLoading(false);
    };

    // Expose ke parent
    useImperativeHandle(ref, () => ({
      isDirty,
    }));

    return (
      <>
        {isLoading && <Loading />}

        <Form
          id="create-task-type-form"
          name="create-task-type"
          onFinish={handleSubmit(onSubmit)}
          layout="vertical"
          requiredMark={false}
        >
          <FormLayout
            left={
              <>
                <TextField
                  control={control}
                  name="name"
                  label="Nama"
                  placeholder="Masukkan nama tipe tugas"
                  errors={errors}
                  required
                />

                <TextAreaField
                  control={control}
                  name="description"
                  label="Deskripsi"
                  placeholder="Masukkan deskripsi tipe tugas"
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
                  required
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
                  required
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
                  required
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
                  required
                />

                <NumberField
                  control={control}
                  name="pointMultiplier"
                  label="Point Multiplier"
                  placeholder="Masukkan angka"
                  errors={errors}
                  required
                  min={0}
                  step={1}
                />
              </>
            }
            bottom={
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                variant="primary"
                className="!px-8"
              >
                Submit
              </Button>
            }
          />
        </Form>
      </>
    );
  }
);

CreateTaskTypeForm.displayName = "CreateTaskTypeForm";
export default CreateTaskTypeForm;
