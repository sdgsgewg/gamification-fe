"use client";

import { Form } from "antd";
import { RcFile, UploadFile } from "antd/es/upload";
import { useToast } from "@/app/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../shared/Button";
import { subjectProvider } from "@/app/functions/SubjectProvider";
import { useEffect, useState } from "react";
import { auth } from "@/app/functions/AuthProvider";
import { Subject } from "@/app/interface/subjects/ISubject";
import TextField from "../../fields/general/TextField";
import TextAreaField from "../../fields/general/TextAreaField";
import ImageField from "../../fields/general/ImageField";
import FormLayout from "@/app/dashboard/form-layout";
import { imageProvider } from "@/app/functions/ImageProvider";

// --- Zod Schema ---
const editSubjectSchema = z.object({
  name: z.string().nonempty("Nama wajib diisi"),
  description: z.string().optional(),
  image: z.string().optional(),
  updatedBy: z.string().nonempty("Pengguna wajib diisi"),
});

export type EditSubjectFormInputs = z.infer<typeof editSubjectSchema>;

interface EditSubjectFormProps {
  onFinish: (values: EditSubjectFormInputs) => void;
  defaultValues?: Subject;
}

export default function EditSubjectForm({
  onFinish,
  defaultValues,
}: EditSubjectFormProps) {
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EditSubjectFormInputs>({
    resolver: zodResolver(editSubjectSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      updatedBy: "",
    },
  });

  const [subjectId, setSubjectId] = useState<string | undefined>(undefined);
  const [oldImageUrl, setOldImageUrl] = useState<string | undefined>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onSubmit = async (data: EditSubjectFormInputs) => {
    if (!subjectId) return;

    try {
      let finalImageUrl = data.image;

      // kalau user pilih gambar baru, upload ke supabase
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const file = fileList[0].originFileObj as RcFile;

        // hapus file lama kalau ada
        if (oldImageUrl) {
          await imageProvider.deleteImage(oldImageUrl, "subjects");
        }

        // upload file baru
        finalImageUrl = await imageProvider.uploadImage(file, "subjects");
      }

      const result = await subjectProvider.updateSubject(subjectId, {
        ...data,
        image: finalImageUrl,
      });

      if (result.ok) {
        toast.success("Mata pelajaran berhasil diperbarui!");
        onFinish({ ...data, image: finalImageUrl });
        setFileList([]); // reset preview
      } else {
        toast.error(result.error || "Pembaruan mata pelajaran gagal.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Gagal upload gambar");
      }
    }
  };

  // Set nilai awal dari props
  useEffect(() => {
    if (defaultValues) {
      setValue("name", defaultValues.name);
      setValue("description", defaultValues.description || "");
      setValue("image", defaultValues.image || "");
      setSubjectId(defaultValues.subjectId);
      setOldImageUrl(defaultValues.image || "");

      // kalau ada image lama, isi fileList supaya muncul preview gambar
      if (defaultValues.image) {
        setFileList([
          {
            uid: "-1",
            name: "old-image.png",
            status: "done",
            url: defaultValues.image,
          } as UploadFile,
        ]);
      }
    }
  }, [defaultValues, setValue]);

  useEffect(() => {
    const user = auth.getCachedUserProfile();
    if (user) {
      setValue("updatedBy", user.name);
    }
  }, [setValue]);

  return (
    <Form
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
            name="image"
            label="Upload Gambar"
            fileList={fileList}
            setFileList={setFileList}
            errors={errors}
            setOldImageUrl={setOldImageUrl}
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
