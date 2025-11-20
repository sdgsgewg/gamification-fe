"use client";

import { Form } from "antd";
import { UploadFile } from "antd/es/upload";
import { useToast } from "@/app/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../shared/Button";
import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { useAuth } from "@/app/hooks/auth/useAuth";
import TextField from "../../fields/TextField";
import TextAreaField from "../../fields/TextAreaField";
import ImageField from "../../fields/ImageField";
import FormLayout from "@/app/dashboard/form-layout";
import Loading from "../../shared/Loading";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { useInitializeForm } from "@/app/hooks/form/useInitializeForm";
import { useInitializeFileList } from "@/app/hooks/file/useInitializeFileList";
import { useNavigationGuard } from "@/app/hooks/useNavigationGuard";
import {
  editClassDefaultValues,
  EditClassFormInputs,
  editClassSchema,
} from "@/app/schemas/classes/editClass";
import { classProvider } from "@/app/functions/ClassProvider";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";
import SelectField from "../../fields/SelectField";

interface EditClassFormProps {
  classData: EditClassFormInputs;
  gradeData: GradeOverviewResponse[];
  onFinish: (values: EditClassFormInputs) => void;
}

const EditClassForm = forwardRef<FormRef, EditClassFormProps>(
  ({ classData, gradeData, onFinish }, ref) => {
    const { toast } = useToast();

    const {
      control,
      handleSubmit,
      formState: { errors, dirtyFields },
      setValue,
      reset,
    } = useForm<EditClassFormInputs>({
      resolver: zodResolver(editClassSchema),
      defaultValues: classData || editClassDefaultValues,
    });

    const { getCachedUserProfile } = useAuth();

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const gradeOptions = useMemo(
      () =>
        gradeData.map((grade) => ({
          value: grade.gradeId,
          label: grade.name,
        })),
      [gradeData]
    );

    useInitializeForm<EditClassFormInputs>(reset, classData, (d) => ({
      ...d,
      updatedBy: getCachedUserProfile()?.name,
    }));
    useInitializeFileList(classData, setFileList);
    const isDirty = Object.keys(dirtyFields).some(
      (field) => field !== "updatedBy"
    );
    useNavigationGuard(isDirty);

    // Handler untuk perubahan upload
    const handleImageChange = (info: any) => {
      let fileList = [...info.fileList];

      // Hanya izinkan satu file
      fileList = fileList.slice(-1);

      // Update fileList state
      setFileList(fileList);

      if (fileList.length > 0 && fileList[0].originFileObj) {
        // Set nilai imageFile ke form
        setValue("imageFile", fileList[0].originFileObj as File, {
          shouldDirty: true,
        });
      } else {
        // Jika tidak ada file, set ke null
        setValue("imageFile", null, { shouldDirty: true });
      }
    };

    const onSubmit = async (data: EditClassFormInputs) => {
      if (!classData || !classData.classId) return;

      const classId = classData.classId;

      setIsLoading(true);

      const formData = new FormData();
      formData.append("data", JSON.stringify(data));

      // Append file images
      if (data.imageFile instanceof File) {
        formData.append("imageFile", data.imageFile);
      }

      const result = await classProvider.updateClass(classId, formData);

      const { isSuccess, message } = result;

      if (isSuccess) {
        toast.success(message ?? "Class has been updated!");
        onFinish(data);
        setFileList([]);
      } else {
        toast.error(message ?? "Class update failed.");
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
          id="edit-subject-form"
          name="edit-subject"
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
                  placeholder="Enter the class name"
                  errors={errors}
                  required
                />

                <TextAreaField
                  control={control}
                  name="description"
                  label="Deskripsi"
                  placeholder="Enter the class description"
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
                onChange={handleImageChange}
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
  }
);

EditClassForm.displayName = "EditClassForm";
export default EditClassForm;
