"use client";

import { useEffect, useState } from "react";
import { Form } from "antd";
import { RcFile, UploadFile } from "antd/es/upload";
import { useToast } from "@/app/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../shared/Button";
import { materialProvider } from "@/app/functions/MaterialProvider";
import { auth } from "@/app/functions/AuthProvider";
import { Material } from "@/app/interface/materials/IMaterial";
import TextField from "../../fields/TextField";
import TextAreaField from "../../fields/TextAreaField";
import ImageField from "../../fields/ImageField";
import FormLayout from "@/app/dashboard/form-layout";
import { imageProvider } from "@/app/functions/ImageProvider";
import { Subject } from "@/app/interface/subjects/ISubject";
import { Grade } from "@/app/interface/grades/IGrade";
import SelectField from "../../fields/SelectField";
import Loading from "../../shared/Loading";

// --- Zod Schema ---
const editMaterialSchema = z.object({
  name: z.string().nonempty("Nama wajib diisi"),
  subjectId: z.string().nonempty("Mata pelajaran wajib dipilih"),
  description: z.string().optional(),
  gradeIds: z.array(z.string()).nonempty("Tingkat kelas wajib dipilih"),
  image: z.string().optional(),
  updatedBy: z.string().nonempty("Pengguna wajib diisi"),
});

export type EditMaterialFormInputs = z.infer<typeof editMaterialSchema>;

interface EditMaterialFormProps {
  defaultValues?: Material;
  subjectData: Subject[];
  gradeData: Grade[];
  onFinish: (values: EditMaterialFormInputs) => void;
}

export default function EditMaterialForm({
  defaultValues,
  subjectData,
  gradeData,
  onFinish,
}: EditMaterialFormProps) {
  const { toast } = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EditMaterialFormInputs>({
    resolver: zodResolver(editMaterialSchema),
    defaultValues: {
      name: "",
      subjectId: "",
      description: "",
      gradeIds: [],
      image: "",
      updatedBy: "",
    },
  });

  const [materialId, setMaterialId] = useState<string | undefined>(undefined);
  const [oldImageUrl, setOldImageUrl] = useState<string | undefined>();
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

  const onSubmit = async (data: EditMaterialFormInputs) => {
    if (!materialId) return;

    setIsLoading(true);

    try {
      let finalImageUrl = data.image;

      // kalau user pilih gambar baru, upload ke supabase
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const file = fileList[0].originFileObj as RcFile;

        // hapus file lama kalau ada
        if (oldImageUrl) {
          await imageProvider.deleteImage(oldImageUrl, "materials");
        }

        // upload file baru
        finalImageUrl = await imageProvider.uploadImage(file, "materials");
      }

      const result = await materialProvider.updateMaterial(materialId, {
        ...data,
        image: finalImageUrl,
      });

      if (result.isSuccess) {
        toast.success("Materi pelajaran berhasil diperbarui!");
        onFinish({ ...data, image: finalImageUrl });
        setFileList([]); // reset preview
      } else {
        toast.error(result.message || "Pembaruan materi pelajaran gagal.");
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

  // Set nilai awal dari props
  useEffect(() => {
    if (defaultValues) {
      setValue("name", defaultValues?.name || "");
      setValue("subjectId", defaultValues?.subject?.subjectId || "");
      setValue("description", defaultValues?.description || "");
      setValue("gradeIds", defaultValues?.gradeIds || []);
      setValue("image", defaultValues?.image || "");
      setMaterialId(defaultValues.materialId);
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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Form
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
              errors={errors.subjectId}
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
              errors={errors.gradeIds}
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
