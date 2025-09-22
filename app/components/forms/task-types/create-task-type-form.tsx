"use client";

import { Form } from "antd";
import { useToast } from "@/app/hooks/use-toast";
import { useForm } from "react-hook-form";
import {
  CreateTaskTypeFormInputs,
  createTaskTypeSchema,
} from "@/app/schemas/task-types/createTaskType";
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

interface CreateTaskTypeFormProps {
  onFinish: (values: CreateTaskTypeFormInputs) => void;
}

export default function CreateTaskTypeForm({
  onFinish,
}: CreateTaskTypeFormProps) {
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateTaskTypeFormInputs>({
    resolver: zodResolver(createTaskTypeSchema),
    defaultValues: {
      name: "",
      description: "",
      scope: "",
      hasDeadline: "",
      isCompetitive: "",
      isRepeatable: "",
      pointMultiplier: 1,
      createdBy: "",
    },
  });

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

  const onSubmit = async (data: CreateTaskTypeFormInputs) => {
    setIsLoading(true);

    try {
      const result = await taskTypeProvider.createTaskType({
        ...data,
      });

      if (result.isSuccess) {
        toast.success("Tipe tugas berhasil dibuat!");
        onFinish({ ...data });
      } else {
        toast.error(result.message || "Pembuatan tipe tugas gagal.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Gagal membuat tipe tugas");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const user = auth.getCachedUserProfile();
    if (user) {
      setValue("createdBy", user.name);
    }
  }, [setValue]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Form
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
  );
}
