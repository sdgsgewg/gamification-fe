"use client";

import {
  useMemo,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { Form } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SelectField from "../../fields/SelectField";
import { AvailableClassesResponse } from "@/app/interface/class-tasks/responses/IAvailableClassesResponse";
import { FormRef } from "@/app/interface/forms/IFormRef";
import {
  shareTaskDefaultValues,
  ShareTaskFormInputs,
  shareTaskSchema,
} from "@/app/schemas/class-tasks/shareTask";
import { useToast } from "@/app/hooks/use-toast";
import { classTaskProvider } from "@/app/functions/ClassTaskProvider";
import TimeField from "../../fields/TimeField";
import DateField from "../../fields/DateField";
import { combineDateTime } from "@/app/utils/date";
import Loading from "../../shared/Loading";

interface ShareTaskFormProps {
  taskId: string;
  classData: AvailableClassesResponse[];
  onFinish: (values: ShareTaskFormInputs) => void;
}

const ShareTaskForm = forwardRef<FormRef, ShareTaskFormProps>(
  ({ taskId, classData, onFinish }, ref) => {
    const { toast } = useToast();

    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
      setValue,
    } = useForm<ShareTaskFormInputs>({
      resolver: zodResolver(shareTaskSchema),
      defaultValues: shareTaskDefaultValues,
    });

    const [isLoading, setIsLoading] = useState(false);

    const classOptions = useMemo(
      () =>
        classData.map((c) => ({
          value: c.id,
          label: c.name,
        })),
      [classData]
    );

    useEffect(() => {
      if (classData) setIsLoading(false);
    }, [classData]);

    useEffect(() => {
      if (taskId) {
        setValue("taskId", taskId);
      }
    }, [taskId, setValue]);

    const onSubmit = async (data: ShareTaskFormInputs) => {
      setIsLoading(true);

      let startTime = undefined;
      let endTime = undefined;

      if (data.startDate && data.startTime && data.endDate && data.endTime) {
        startTime = combineDateTime(data.startDate, data.startTime);
        endTime = combineDateTime(data.endDate, data.endTime);
      }

      const payload: ShareTaskFormInputs = {
        ...data,
        taskId,
        startTime,
        endTime,
      };

      console.log("Payload share task: ", JSON.stringify(payload, null, 2));

      const result = await classTaskProvider.shareTaskIntoClasses(payload);
      const { isSuccess, message } = result;

      if (isSuccess) {
        toast.success(message ?? "Task has been shared!");
        onFinish(data);
      } else {
        toast.error(message ?? "Failed to share task.");
      }

      setIsLoading(false);
    };

    useImperativeHandle(ref, () => ({
      resetForm: () => reset(),
    }));

    return (
      <>
        {isLoading && <Loading />}

        <Form
          id="share-task-form"
          name="share-task"
          onFinish={handleSubmit(onSubmit)}
          layout="vertical"
          className="flex flex-col gap-8"
        >
          <SelectField
            control={control}
            name="classIds"
            label="Class"
            placeholder={
              classData.length === 0
                ? "No available classes to share this task."
                : "Choose class"
            }
            options={classOptions}
            loading={isLoading}
            disabled={classData.length === 0 || isLoading}
            mode="multiple"
          />

          <div className="w-full flex flex-col gap-2 mb-0">
            <p className="text-base font-medium">Start Time</p>
            <div className="w-full flex flex-row items-center gap-8">
              <div className="flex-1">
                <DateField
                  control={control}
                  name="startDate"
                  label="Date"
                  placeholder="Enter date"
                  errors={errors}
                />
              </div>
              <div className="flex-1">
                <TimeField
                  control={control}
                  name="startTime"
                  label="Time"
                  placeholder="Enter time"
                  errors={errors}
                />
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2 mb-0">
            <p className="text-base font-medium">End Time</p>
            <div className="w-full flex flex-row items-center gap-8">
              <div className="flex-1">
                <DateField
                  control={control}
                  name="endDate"
                  label="Date"
                  placeholder="Enter date"
                  errors={errors}
                />
              </div>
              <div className="flex-1">
                <TimeField
                  control={control}
                  name="endTime"
                  label="Time"
                  placeholder="Enter time"
                  errors={errors}
                />
              </div>
            </div>
          </div>
        </Form>
      </>
    );
  }
);

ShareTaskForm.displayName = "ShareTaskForm";
export default ShareTaskForm;
