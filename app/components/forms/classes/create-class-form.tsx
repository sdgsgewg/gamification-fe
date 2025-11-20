"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { Form } from "antd";
import { UploadFile } from "antd/es/upload";
import { useToast } from "@/app/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../shared/Button";
import TextField from "../../fields/TextField";
import TextAreaField from "../../fields/TextAreaField";
import ImageField from "../../fields/ImageField";
import FormLayout from "@/app/dashboard/form-layout";
import Loading from "../../shared/Loading";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { useNavigationGuard } from "@/app/hooks/useNavigationGuard";
import {
  createClassDefaultValues,
  CreateClassFormInputs,
  createClassSchema,
} from "@/app/schemas/classes/createClass";
import { useInjectUser } from "@/app/hooks/form/useInjectUser";
import { classProvider } from "@/app/functions/ClassProvider";
import SelectField from "../../fields/SelectField";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";

interface CreateClassFormProps {
  gradeData: GradeOverviewResponse[];
  onFinish: (values: CreateClassFormInputs) => void;
}

const CreateClassForm = forwardRef<
  FormRef<CreateClassFormInputs>,
  CreateClassFormProps
>(({ gradeData, onFinish }, ref) => {
  const { toast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
    setValue,
  } = useForm<CreateClassFormInputs>({
    resolver: zodResolver(createClassSchema),
    defaultValues: createClassDefaultValues,
  });

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useInjectUser(setValue, ["createdBy"]);
  useInjectUser(setValue, ["teacherId"]);
  const isDirty = Object.keys(dirtyFields).some(
    (field) => field !== "createdBy"
  );
  useNavigationGuard(isDirty);

  const gradeOptions = useMemo(
    () =>
      gradeData.map((grade) => ({
        value: grade.gradeId,
        label: grade.name,
      })),
    [gradeData]
  );

  const onSubmit = async (data: CreateClassFormInputs) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    // Append image file
    if (data.imageFile instanceof File) {
      formData.append("imageFile", data.imageFile);
    }

    const result = await classProvider.createClass(formData);
    const { isSuccess, message } = result;

    if (isSuccess) {
      toast.success(message ?? "Class has been created!");
      onFinish(data);
      setFileList([]);
    } else {
      toast.error(message ?? "Failed to create class.");
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
        id="create-subject-form"
        name="create-subject"
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
                placeholder="Enter class name"
                errors={errors}
                required
              />

              <TextAreaField
                control={control}
                name="description"
                label="Description"
                placeholder="Enter class description"
                errors={errors}
              />

              <SelectField
                control={control}
                name="gradeIds"
                label="Grade Levels"
                placeholder="Select grade levels"
                options={gradeOptions}
                errors={errors}
                loading={gradeOptions.length === 0}
                disabled={gradeOptions.length === 0}
                mode="multiple"
              />
            </>
          }
          right={
            <ImageField
              control={control}
              name="imageFile"
              label="Upload Image"
              fileList={fileList}
              setFileList={setFileList}
              errors={errors}
              mode="file"
            />
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
});

CreateClassForm.displayName = "CreateClassForm";
export default CreateClassForm;
