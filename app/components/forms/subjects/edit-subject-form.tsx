"use client";

import { Form } from "antd";
import { UploadFile } from "antd/es/upload";
import { useToast } from "@/app/hooks/use-toast";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../shared/Button";
import { subjectProvider } from "@/app/functions/SubjectProvider";
import { forwardRef, useImperativeHandle, useState } from "react";
import { auth } from "@/app/functions/AuthProvider";
import TextField from "../../fields/TextField";
import TextAreaField from "../../fields/TextAreaField";
import ImageField from "../../fields/ImageField";
import FormLayout from "@/app/dashboard/form-layout";
import {
  editSubjectDefaultValues,
  EditSubjectFormInputs,
  editSubjectSchema,
} from "@/app/schemas/subjects/editSubject";
import { getItem, removeItem } from "@/app/utils/storage";
import {
  useAutoSaveDraft,
  useDirtyCheckWithDefaults,
  useInitializeFileList,
  useInitializeForm,
} from "@/app/utils/form";
import Loading from "../../shared/Loading";
import { FormRef } from "@/app/interface/forms/IFormRef";

interface EditSubjectFormProps {
  subjectData?: EditSubjectFormInputs;
  onFinish: (values: EditSubjectFormInputs) => void;
}

const EditSubjectForm = forwardRef<FormRef, EditSubjectFormProps>(
  ({ subjectData, onFinish }, ref) => {
    const { toast } = useToast();

    const savedDraft =
      typeof window !== "undefined" ? getItem("subjectDraft") : null;

    const defaultValues = savedDraft
      ? JSON.parse(savedDraft)
      : subjectData || editSubjectDefaultValues;

    const {
      control,
      handleSubmit,
      formState: { errors },
      setValue,
      reset,
    } = useForm<EditSubjectFormInputs>({
      resolver: zodResolver(editSubjectSchema),
      defaultValues,
    });

    const watchedValues = useWatch({ control });
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useInitializeForm<EditSubjectFormInputs>(reset, subjectData, (d) => ({
      ...d,
      updatedBy: auth.getCachedUserProfile()?.name,
    }));
    useInitializeFileList(subjectData, setFileList);
    useAutoSaveDraft(watchedValues, "subjectDraft");
    const isDirty = useDirtyCheckWithDefaults(
      watchedValues,
      subjectData || editSubjectDefaultValues,
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

    const onSubmit = async (data: EditSubjectFormInputs) => {
      if (!subjectData || !subjectData.subjectId) return;

      const subjectId = subjectData.subjectId;

      setIsLoading(true);

      const formData = new FormData();
      formData.append("data", JSON.stringify(data));

      // Append file images
      if (data.imageFile instanceof File) {
        formData.append("imageFile", data.imageFile);
      }

      const result = await subjectProvider.updateSubject(subjectId, formData);

      const { isSuccess, message } = result;

      if (isSuccess) {
        toast.success(message ?? "Mata pelajaran berhasil diperbarui!");
        removeItem("subjectDraft");
        onFinish(data);
        setFileList([]);
      } else {
        toast.error(message ?? "Pembaruan mata pelajaran gagal.");
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
                  placeholder="Masukkan nama mata pelajaran"
                  errors={errors}
                  required
                />

                <TextAreaField
                  control={control}
                  name="description"
                  label="Deskripsi"
                  placeholder="Masukkan deskripsi mata pelajaran"
                  errors={errors}
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

EditSubjectForm.displayName = "EditSubjectForm";
export default EditSubjectForm;
