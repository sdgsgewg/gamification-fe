"use client";

import { Form } from "antd";
import { useToast } from "@/app/hooks/use-toast";
import { useForm } from "react-hook-form";
import {
  editTaskTypeDefaultValues,
  EditTaskTypeFormInputs,
  editTaskTypeSchema,
} from "@/app/schemas/task-types/editTaskType";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../shared/Button";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import TextField from "../../fields/TextField";
import TextAreaField from "../../fields/TextAreaField";
import FormLayout from "@/app/dashboard/form-layout";
import Loading from "../../shared/Loading";
import SelectField from "../../fields/SelectField";
import { taskTypeProvider } from "@/app/functions/TaskTypeProvider";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { TaskTypeScope, TaskTypeScopeLabels } from "@/app/enums/TaskTypeScope";
import { BooleanField, BooleanFieldLabels } from "@/app/enums/BooleanField";
import { useInitializeForm } from "@/app/hooks/form/useInitializeForm";
import { useNavigationGuard } from "@/app/hooks/useNavigationGuard";

interface EditTaskTypeFormProps {
  taskTypeData?: EditTaskTypeFormInputs;
  onFinish: (values: EditTaskTypeFormInputs) => void;
}

const EditTaskTypeForm = forwardRef<FormRef, EditTaskTypeFormProps>(
  ({ taskTypeData, onFinish }, ref) => {
    const { toast } = useToast();

    const {
      control,
      handleSubmit,
      formState: { errors, dirtyFields },
      reset,
    } = useForm<EditTaskTypeFormInputs>({
      resolver: zodResolver(editTaskTypeSchema),
      defaultValues: taskTypeData || editTaskTypeDefaultValues,
    });

    const { getCachedUserProfile } = useAuth();

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

    // Initialize form with data and inject updatedBy
    useInitializeForm<EditTaskTypeFormInputs>(reset, taskTypeData, (d) => ({
      ...d,
      updatedBy: getCachedUserProfile()?.name,
    }));

    const isDirty = Object.keys(dirtyFields).some(
      (field) => field !== "updatedBy"
    );

    useNavigationGuard(isDirty);

    // Submit handler
    const onSubmit = async (data: EditTaskTypeFormInputs) => {
      if (!taskTypeData || !taskTypeData.taskTypeId) return;

      const taskTypeId = taskTypeData.taskTypeId;
      setIsLoading(true);

      const result = await taskTypeProvider.updateTaskType(taskTypeId, data);
      const { isSuccess, message } = result;

      if (isSuccess) {
        toast.success(message ?? "Task type successfully updated!");
        onFinish(data);
      } else {
        toast.error(message ?? "Failed to update task type.");
      }

      setIsLoading(false);
    };

    // Expose to parent
    useImperativeHandle(ref, () => ({
      isDirty,
    }));

    return (
      <>
        {isLoading && <Loading />}

        <Form
          id="edit-task-type-form"
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
                  label="Name"
                  placeholder="Enter task type name"
                  errors={errors}
                  required
                />

                <TextAreaField
                  control={control}
                  name="description"
                  label="Description"
                  placeholder="Enter task type description"
                  errors={errors}
                />

                <SelectField
                  control={control}
                  name="scope"
                  label="Scope"
                  placeholder="Select scope"
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
                  placeholder="Select value"
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
                  placeholder="Select value"
                  options={booleanFieldOptions}
                  errors={errors}
                  loading={booleanFieldOptions.length === 0}
                  disabled={booleanFieldOptions.length === 0}
                  required
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

EditTaskTypeForm.displayName = "EditTaskTypeForm";
export default EditTaskTypeForm;