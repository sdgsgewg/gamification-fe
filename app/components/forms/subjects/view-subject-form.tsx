"use client";

import { Form } from "antd";
import { UploadFile } from "antd/es/upload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../shared/Button";
import { useEffect, useState } from "react";
import { Subject } from "@/app/interface/subjects/ISubject";
import TextField from "../../fields/general/TextField";
import TextAreaField from "../../fields/general/TextAreaField";
import ImageField from "../../fields/general/ImageField";
import FormLayout from "@/app/dashboard/form-layout";

// --- Zod Schema ---
const viewSubjectSchema = z.object({
  name: z.string().nonempty("Nama wajib diisi"),
  description: z.string().optional(),
  image: z.string().optional(),
});

export type ViewSubjectFormInputs = z.infer<typeof viewSubjectSchema>;
interface ViewSubjectFormProps {
  defaultValues?: Subject;
}

export default function ViewSubjectForm({
  defaultValues,
}: ViewSubjectFormProps) {
  const {
    control,
    formState: { errors },
    setValue,
  } = useForm<ViewSubjectFormInputs>({
    resolver: zodResolver(viewSubjectSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
    },
  });

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Set nilai awal dari props
  useEffect(() => {
    if (defaultValues) {
      setValue("name", defaultValues.name);
      setValue("description", defaultValues.description || "");
      setValue("image", defaultValues.image || "");

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

  return (
    <Form name="view-subject" layout="vertical" requiredMark={false}>
      <FormLayout
        left={
          <>
            <TextField
              control={control}
              name="name"
              label="Nama"
              placeholder="Masukkan nama mata pelajaran"
              errors={errors}
              readonly
            />

            <TextAreaField
              control={control}
              name="description"
              label="Deskripsi"
              placeholder="Masukkan deskripsi mata pelajaran"
              errors={errors}
              readonly
            />
          </>
        }
        right={
          <ImageField
            control={control}
            name="image"
            label="Gambar Mata Pelajaran"
            fileList={fileList}
            setFileList={setFileList}
            errors={errors}
            readonly
          />
        }
      />
    </Form>
  );
}
