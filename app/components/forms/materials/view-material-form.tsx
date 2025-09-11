"use client";

import { useEffect, useState } from "react";
import { Form } from "antd";
import { UploadFile } from "antd/es/upload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Material } from "@/app/interface/materials/IMaterial";
import TextField from "../../fields/TextField";
import TextAreaField from "../../fields/TextAreaField";
import ImageField from "../../fields/ImageField";
import FormLayout from "@/app/dashboard/form-layout";

// --- Zod Schema ---
const viewMaterialSchema = z.object({
  name: z.string().nonempty("Nama wajib diisi"),
  subjectId: z.string().nonempty("Mata pelajaran wajib dipilih"),
  description: z.string().optional(),
  gradeIds: z.array(z.string()).optional(),
  image: z.string().optional(),
});

export type ViewMaterialFormInputs = z.infer<typeof viewMaterialSchema>;
interface ViewMaterialFormProps {
  defaultValues?: Material;
}

export default function ViewMaterialForm({
  defaultValues,
}: ViewMaterialFormProps) {
  const {
    control,
    formState: { errors },
    setValue,
  } = useForm<ViewMaterialFormInputs>({
    resolver: zodResolver(viewMaterialSchema),
    defaultValues: {
      name: "",
      subjectId: "",
      description: "",
      gradeIds: [],
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
    <Form name="view-material" layout="vertical" requiredMark={false}>
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
