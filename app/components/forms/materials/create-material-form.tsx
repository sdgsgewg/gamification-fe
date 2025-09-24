"use client";

import { Form } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useToast } from "@/app/hooks/use-toast";
import { useForm, useWatch } from "react-hook-form";
import {
  createMaterialDefaultValues,
  CreateMaterialFormInputs,
  createMaterialSchema,
} from "@/app/schemas/materials/createMaterial";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../shared/Button";
import { forwardRef, useImperativeHandle, useState } from "react";
import TextField from "../../fields/TextField";
import TextAreaField from "../../fields/TextAreaField";
import ImageField from "../../fields/ImageField";
import FormLayout from "@/app/dashboard/form-layout";
import { materialProvider } from "@/app/functions/MaterialProvider";
import Loading from "../../shared/Loading";
import SelectField from "../../fields/SelectField";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { useDirtyCheck, useInjectUser } from "@/app/utils/form";

interface CreateMaterialFormProps {
  subjectData: SubjectOverviewResponse[];
  gradeData: GradeOverviewResponse[];
  onFinish: (values: CreateMaterialFormInputs) => void;
}

const CreateMaterialForm = forwardRef<FormRef, CreateMaterialFormProps>(
  ({ subjectData, gradeData, onFinish }, ref) => {
    const { toast } = useToast();

    const {
      control,
      handleSubmit,
      formState: { errors },
      setValue,
    } = useForm<CreateMaterialFormInputs>({
      resolver: zodResolver(createMaterialSchema),
      defaultValues: createMaterialDefaultValues,
    });

    const watchedValues = useWatch({ control });
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

    useInjectUser(setValue, ["createdBy"]);
    const isDirty = useDirtyCheck(watchedValues, ["createdBy"]);

    const onSubmit = async (data: CreateMaterialFormInputs) => {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("data", JSON.stringify(data));

      // Append file images
      if (data.imageFile instanceof File) {
        formData.append("imageFile", data.imageFile);
      }

      const result = await materialProvider.createMaterial(formData);

      const { isSuccess, message } = result;

      if (isSuccess) {
        toast.success(message ?? "Materi pelajaran berhasil dibuat!");
        onFinish(data);
        setFileList([]);
      } else {
        toast.error(message ?? "Pembuatan materi pelajaran gagal.");
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
          id="create-material-form"
          name="create-material"
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
                  placeholder="Masukkan nama materi pelajaran"
                  errors={errors}
                  required
                />

                <SelectField
                  control={control}
                  name="subjectId"
                  label="Mata Pelajaran"
                  placeholder="Pilih mata pelajaran"
                  options={subjectOptions}
                  errors={errors}
                  loading={subjectOptions.length === 0}
                  disabled={subjectOptions.length === 0}
                  required
                />

                <TextAreaField
                  control={control}
                  name="description"
                  label="Deskripsi"
                  placeholder="Masukkan deskripsi materi pelajaran"
                  errors={errors}
                />

                <SelectField
                  control={control}
                  name="gradeIds"
                  label="Tingkat Kelas"
                  placeholder="Pilih tingkat kelas"
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
                label="Upload Gambar"
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
  }
);

CreateMaterialForm.displayName = "CreateMaterialForm";
export default CreateMaterialForm;
