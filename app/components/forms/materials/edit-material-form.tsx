"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Form } from "antd";
import { UploadFile } from "antd/es/upload";
import { useToast } from "@/app/hooks/use-toast";
import { useForm, useWatch } from "react-hook-form";
import {
  editMaterialDefaultValues,
  EditMaterialFormInputs,
  editMaterialSchema,
} from "@/app/schemas/materials/editMaterial";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../shared/Button";
import { materialProvider } from "@/app/functions/MaterialProvider";
import { auth } from "@/app/functions/AuthProvider";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";
import TextField from "../../fields/TextField";
import TextAreaField from "../../fields/TextAreaField";
import ImageField from "../../fields/ImageField";
import FormLayout from "@/app/dashboard/form-layout";
import SelectField from "../../fields/SelectField";
import Loading from "../../shared/Loading";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { getItem, removeItem } from "@/app/utils/storage";
import {
  useAutoSaveDraft,
  useDirtyCheckWithDefaults,
  useInitializeFileList,
  useInitializeForm,
} from "@/app/utils/form";

interface EditMaterialFormProps {
  materialData?: EditMaterialFormInputs;
  subjectData: SubjectOverviewResponse[];
  gradeData: GradeOverviewResponse[];
  onFinish: (values: EditMaterialFormInputs) => void;
}

const EditMaterialForm = forwardRef<FormRef, EditMaterialFormProps>(
  ({ materialData, subjectData, gradeData, onFinish }, ref) => {
    const { toast } = useToast();

    const savedDraft =
      typeof window !== "undefined" ? getItem("materialDraft") : null;

    const defaultValues = savedDraft
      ? JSON.parse(savedDraft)
      : subjectData || editMaterialDefaultValues;

    const {
      control,
      handleSubmit,
      formState: { errors },
      setValue,
      reset,
    } = useForm<EditMaterialFormInputs>({
      resolver: zodResolver(editMaterialSchema),
      defaultValues,
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

    useInitializeForm<EditMaterialFormInputs>(reset, materialData, (d) => ({
      ...d,
      updatedBy: auth.getCachedUserProfile()?.name,
    }));
    useInitializeFileList(materialData, setFileList);
    useAutoSaveDraft(watchedValues, "materialDraft");
    const isDirty = useDirtyCheckWithDefaults(
      watchedValues,
      materialData || editMaterialDefaultValues,
      ["updatedBy"]
    );

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

    const onSubmit = async (data: EditMaterialFormInputs) => {
      if (!materialData || !materialData.materialId) return;

      const materialId = materialData.materialId;

      setIsLoading(true);

      const formData = new FormData();
      formData.append("data", JSON.stringify(data));

      // Append file images
      if (data.imageFile instanceof File) {
        formData.append("imageFile", data.imageFile);
      }

      const result = await materialProvider.updateMaterial(
        materialId,
        formData
      );

      const { isSuccess, message } = result;

      if (isSuccess) {
        toast.success(message ?? "Materi pelajaran berhasil diperbarui!");
        removeItem("materialDraft");
        onFinish(data);
        setFileList([]);
      } else {
        toast.error(message ?? "Pembaruan materi pelajaran gagal.");
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
                  placeholder="Masukkan deskripsi mata pelajaran"
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
