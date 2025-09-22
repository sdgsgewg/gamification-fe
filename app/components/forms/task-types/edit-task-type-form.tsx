"use client";

import { Form } from "antd";
import { useToast } from "@/app/hooks/use-toast";
import { useForm } from "react-hook-form";
import {
  EditTaskTypeFormInputs,
  editTaskTypeSchema,
} from "@/app/schemas/task-types/editTaskType";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../shared/Button";
import { useEffect, useState } from "react";
import { auth } from "@/app/functions/AuthProvider";
import TextField from "../../fields/TextField";
import TextAreaField from "../../fields/TextAreaField";
import FormLayout from "@/app/dashboard/form-layout";
import Loading from "../../shared/Loading";
import SelectField from "../../fields/SelectField";
import { taskTypeProvider } from "@/app/functions/TaskTypeProvider";
import NumberField from "../../fields/NumberField";
import { TaskTypeDetailResponse } from "@/app/interface/task-types/responses/ITaskTypeDetailResponse";

interface EditTaskTypeFormProps {
  defaultValues?: TaskTypeDetailResponse;
  onFinish: (values: EditTaskTypeFormInputs) => void;
}

export default function EditTaskTypeForm({
  defaultValues,
  onFinish,
}: EditTaskTypeFormProps) {
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EditTaskTypeFormInputs>({
    resolver: zodResolver(editTaskTypeSchema),
    defaultValues: {
      name: "",
      description: "",
      scope: "",
      hasDeadline: "",
      isCompetitive: "",
      isRepeatable: "",
      pointMultiplier: 1,
      updatedBy: "",
    },
  });

  const [taskTypeId, setTaskTypeId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // Prepare options for select fields
  const scopeOptions = [
    { value: "global", label: "Global" },
    { value: "class", label: "Class" },
    { value: "both", label: "Both" },
  ];

  const booleanFieldOptions = [
    { value: "true", label: "BENAR" },
    { value: "false", label: "SALAH" },
  ];

  const onSubmit = async (data: EditTaskTypeFormInputs) => {
    if (!taskTypeId) return;

    setIsLoading(true);

    try {
      const result = await taskTypeProvider.updateTaskType(taskTypeId, {
        ...data,
      });

      if (result.isSuccess) {
        toast.success("Tipe tugas berhasil diperbarui!");
        onFinish({ ...data });
      } else {
        toast.error(result.message || "Pembaruan tipe tugas gagal.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Gagal memperbarui tipe tugas");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Set nilai awal dari props
  useEffect(() => {
    if (defaultValues) {
      setValue("name", defaultValues?.name || "");
      setValue("description", defaultValues?.description || "");
      setValue("scope", defaultValues?.scope || "");
      setValue("hasDeadline", defaultValues?.hasDeadline ? "true" : "false");
      setValue(
        "isCompetitive",
        defaultValues?.isCompetitive ? "true" : "false"
      );
      setValue("isRepeatable", defaultValues?.isRepeatable ? "true" : "false");
      setValue("pointMultiplier", defaultValues?.pointMultiplier || 1);
      setTaskTypeId(defaultValues.taskTypeId);
    }
  }, [defaultValues, setValue]);

  useEffect(() => {
    const user = auth.getCachedUserProfile();
    if (user) {
      setValue("updatedBy", user.name);
    }
  }, [setValue]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Form
      name="edit-task-type"
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
  );
}
