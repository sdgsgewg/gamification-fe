"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Form } from "antd";
import { UploadFile } from "antd/es/upload";
import { useToast } from "@/app/hooks/use-toast";
import { useForm } from "react-hook-form";
import {
  editMaterialDefaultValues,
  EditMaterialFormInputs,
  editMaterialSchema,
} from "@/app/schemas/materials/editMaterial";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../shared/Button";
import { materialProvider } from "@/app/functions/MaterialProvider";
import { useAuth } from "@/app/hooks/useAuth";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";
import TextField from "../../fields/TextField";
import TextAreaField from "../../fields/TextAreaField";
import ImageField from "../../fields/ImageField";
import FormLayout from "@/app/dashboard/form-layout";
import SelectField from "../../fields/SelectField";
import Loading from "../../shared/Loading";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { useInitializeForm } from "@/app/hooks/form/useInitializeForm";
import { useInitializeFileList } from "@/app/hooks/file/useInitializeFileList";
import { useNavigationGuard } from "@/app/hooks/useNavigationGuard";

interface EditMaterialFormProps {
  materialData?: EditMaterialFormInputs;
  subjectData: SubjectOverviewResponse[];
  gradeData: GradeOverviewResponse[];
  onFinish: (values: EditMaterialFormInputs) => void;
}

const EditMaterialForm = forwardRef<FormRef, EditMaterialFormProps>(
  ({ materialData, subjectData, gradeData, onFinish }, ref) => {
    const { toast } = useToast();

    const {
      control,
      handleSubmit,
      formState: { errors, dirtyFields },
      setValue,
      reset,
    } = useForm<EditMaterialFormInputs>({
      resolver: zodResolver(editMaterialSchema),
      defaultValues: materialData || editMaterialDefaultValues,
    });

    const { getCachedUserProfile } = useAuth();

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Prepare options for select fields
    const subjectOptions = subjectData.map((subject) => ({
      value: subject.subjectId,
      label: subject.name,
    }));

    const gradeOptions = gradeData.map((grade) => ({
      value: grade.gradeId,
      label: grade.name,
    }));

    useInitializeForm<EditMaterialFormInputs>(reset, materialData, (d) => ({
      ...d,
      updatedBy: getCachedUserProfile()?.name,
    }));
    useInitializeFileList(materialData, setFileList);
    const isDirty = Object.keys(dirtyFields).some(
      (field) => field !== "updatedBy"
    );
    useNavigationGuard(isDirty);

    // Handler for upload changes
    const handleImageChange = (info: any) => {
      let fileList = [...info.fileList];

      // Only allow one file
      fileList = fileList.slice(-1);

      // Update fileList state
      setFileList(fileList);

      if (fileList.length > 0 && fileList[0].originFileObj) {
        // Set imageFile value in the form
        setValue("imageFile", fileList[0].originFileObj as File, {
          shouldDirty: true,
        });
      } else {
        // If no file, set to null
        setValue("imageFile", null, { shouldDirty: true });
      }
    };

    const onSubmit = async (data: EditMaterialFormInputs) => {
      if (!materialData || !materialData.materialId) return;

      const materialId = materialData.materialId;

      setIsLoading(true);

      const formData = new FormData();
      formData.append("data", JSON.stringify(data));

      // Append image file
      if (data.imageFile instanceof File) {
        formData.append("imageFile", data.imageFile);
      }

      const result = await materialProvider.updateMaterial(
        materialId,
        formData
      );

      const { isSuccess, message } = result;

      if (isSuccess) {
        toast.success(message ?? "Study material successfully updated!");
        onFinish(data);
        setFileList([]);
      } else {
        toast.error(message ?? "Failed to update study material.");
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
          id="edit-material-form"
          name="edit-material"
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
                  placeholder="Enter the name of the study material"
                  errors={errors}
                  required
                />

                <SelectField
                  control={control}
                  name="subjectId"
                  label="Subject"
                  placeholder="Select a subject"
                  options={subjectOptions}
                  errors={errors}
                  loading={subjectOptions.length === 0}
                  disabled={subjectOptions.length === 0}
                  required
                />

                <TextAreaField
                  control={control}
                  name="description"
                  label="Description"
                  placeholder="Enter the study material description"
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

EditMaterialForm.displayName = "EditMaterialForm";
export default EditMaterialForm;