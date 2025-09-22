"use client";

import { Form } from "antd";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import { useToast } from "@/app/hooks/use-toast";
import { useForm } from "react-hook-form";
import {
  CreateMaterialFormInputs,
  createMaterialSchema,
} from "@/app/schemas/materials/createMaterial";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../shared/Button";
import { useEffect, useState } from "react";
import { auth } from "@/app/functions/AuthProvider";
import TextField from "../../fields/TextField";
import TextAreaField from "../../fields/TextAreaField";
import ImageField from "../../fields/ImageField";
import FormLayout from "@/app/dashboard/form-layout";
import { imageProvider } from "@/app/functions/ImageProvider";
import { materialProvider } from "@/app/functions/MaterialProvider";
import Loading from "../../shared/Loading";
import SelectField from "../../fields/SelectField";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";

interface CreateMaterialFormProps {
  subjectData: SubjectOverviewResponse[];
  gradeData: GradeOverviewResponse[];
  onFinish: (values: CreateMaterialFormInputs) => void;
}

export default function CreateMaterialForm({
  subjectData,
  gradeData,
  onFinish,
}: CreateMaterialFormProps) {
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateMaterialFormInputs>({
    resolver: zodResolver(createMaterialSchema),
    defaultValues: {
      name: "",
      subjectId: "",
      description: "",
      gradeIds: [],
      image: "",
      createdBy: "",
    },
  });

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

  const onSubmit = async (data: CreateMaterialFormInputs) => {
    setIsLoading(true);

    try {
      let finalImageUrl = data.image;

      // Jika user upload file baru (preview blob), upload dulu ke Supabase
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const file = fileList[0].originFileObj as RcFile;
        finalImageUrl = await imageProvider.uploadImage(file, "materials");
      }

      const result = await materialProvider.createMaterial({
        ...data,
        image: finalImageUrl,
      });

      if (result.isSuccess) {
        toast.success("Materi pelajaran berhasil dibuat!");
        onFinish({ ...data, image: finalImageUrl });
        setFileList([]); // reset file list
      } else {
        toast.error(result.message || "Pembuatan materi pelajaran gagal.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Gagal upload gambar");
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
            name="image"
            label="Upload Gambar"
            fileList={fileList}
            setFileList={setFileList}
            errors={errors}
            mode="url"
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
  );
}
