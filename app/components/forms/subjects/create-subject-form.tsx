"use client";

import { Form } from "antd";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import { useToast } from "@/app/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../shared/Button";
import { subjectProvider } from "@/app/functions/SubjectProvider";
import { useEffect, useState } from "react";
import { auth } from "@/app/functions/AuthProvider";
import TextField from "../../fields/general/TextField";
import TextAreaField from "../../fields/general/TextAreaField";
import ImageField from "../../fields/general/ImageField";
import FormLayout from "@/app/dashboard/form-layout";
import { imageProvider } from "@/app/functions/ImageProvider";

// --- Zod Schema ---
const createSubjectSchema = z.object({
  name: z.string().nonempty("Nama wajib diisi"),
  description: z.string().optional(),
  image: z.string().optional(),
  createdBy: z.string().nonempty("Pengguna wajib diisi"),
});

export type CreateSubjectFormInputs = z.infer<typeof createSubjectSchema>;

interface CreateSubjectFormProps {
  onFinish: (values: CreateSubjectFormInputs) => void;
}

export default function CreateSubjectForm({
  onFinish,
}: CreateSubjectFormProps) {
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateSubjectFormInputs>({
    resolver: zodResolver(createSubjectSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      createdBy: "",
    },
  });

  // Controlled Upload state
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onSubmit = async (data: CreateSubjectFormInputs) => {
    try {
      let finalImageUrl = data.image;

      // Jika user upload file baru (preview blob), upload dulu ke Supabase
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const file = fileList[0].originFileObj as RcFile;
        finalImageUrl = await imageProvider.uploadImage(file);
      }

      const result = await subjectProvider.createSubject({
        ...data,
        image: finalImageUrl,
      });

      if (result.ok) {
        toast.success("Mata pelajaran berhasil dibuat!");
        onFinish({ ...data, image: finalImageUrl });
        setFileList([]); // reset file list
      } else {
        toast.error(result.error || "Pembuatan mata pelajaran gagal.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Gagal upload gambar");
      }
    }
  };

  useEffect(() => {
    const user = auth.getCachedUserProfile();
    if (user) {
      setValue("createdBy", user.name);
    }
  }, [setValue]);

  return (
    <Form
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
            name="image"
            label="Upload Gambar"
            fileList={fileList}
            setFileList={setFileList}
            errors={errors}
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
