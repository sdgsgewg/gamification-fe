"use client";

import { Form, Upload } from "antd";
import { Controller } from "react-hook-form";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useState } from "react";
import { getImageSrc } from "@/app/utils/image";
import Label from "./Label";

interface ImageFieldProps {
  control: any;
  name: string;
  label: string;
  fileList: UploadFile[];
  setFileList: (files: UploadFile[]) => void;
  errors?: Record<string, any>;
  required?: boolean;
  readonly?: boolean;
  setOldImageUrl?: (url?: string | undefined) => void;
  mode?: "file" | "url";
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
  onChange?: (value: File | string | null) => void;
}

const ImageField = ({
  control,
  name,
  label,
  fileList,
  setFileList,
  errors,
  required,
  readonly,
  setOldImageUrl,
  mode = "file",
  beforeUpload,
  onChange,
}: ImageFieldProps) => {
  const [hovered, setHovered] = useState(false);

  // semua logika beforeUpload ditaruh di sini
  const handleBeforeUpload = async (
    file: RcFile,
    fieldOnChange: (value: any) => void
  ) => {
    if (readonly) return false;

    if (beforeUpload) {
      // Jalankan handler parent dulu
      const shouldUpload = await beforeUpload(file);

      // Kalau parent return false (prevent auto upload) tetap update preview
      setFileList([
        {
          uid: file.uid,
          name: file.name,
          status: "done",
          url: URL.createObjectURL(file),
          originFileObj: file,
        },
      ]);
      fieldOnChange(file);
      onChange?.(file);

      return shouldUpload;
    }

    // Default behaviour kalau tidak ada custom handler
    if (mode === "file") {
      setFileList([
        {
          uid: file.uid,
          name: file.name,
          status: "done",
          url: URL.createObjectURL(file),
          originFileObj: file,
        },
      ]);
      fieldOnChange(file);
      onChange?.(file);
    }

    return false; // prevent auto upload ke server
  };

  const handleChange = (info: any) => {
    if (onChange) {
      onChange(info);
    }
  };

  return (
    <Form.Item
      label={
        label && (
          <Label
            label={label}
            required={required}
            optional={true}
            readonly={readonly}
          />
        )
      }
      name={name}
      validateStatus={errors?.[name] ? "error" : ""}
      help={errors?.[name]?.message}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Upload
            accept="image/*"
            listType="picture-card"
            maxCount={1}
            showUploadList={false}
            fileList={fileList}
            disabled={readonly}
            beforeUpload={(file: RcFile) =>
              handleBeforeUpload(file, field.onChange)
            }
            onChange={handleChange}
          >
            {fileList.length > 0 ? (
              <div
                className="relative group w-60 aspect-square"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <Image
                  src={getImageSrc(fileList[0]) ?? ""}
                  alt={fileList[0].name}
                  width={200}
                  height={200}
                  className="rounded-lg object-cover w-full h-full"
                />
                {hovered && !readonly && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFileList([]);
                        field.onChange(mode === "file" ? null : "");
                        if (setOldImageUrl) setOldImageUrl(undefined);
                      }}
                      className="flex items-center gap-2 text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg shadow cursor-pointer"
                    >
                      <DeleteOutlined /> Hapus
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-60 aspect-square border-2 border-dashed rounded-lg text-dark hover:border-blue-500 hover:text-blue-500 transition cursor-pointer">
                <PlusOutlined className="text-2xl mb-2" />
                <span className="text-sm">
                  {readonly ? "Tidak ada gambar" : "Upload"}
                </span>
              </div>
            )}
          </Upload>
        )}
      />
    </Form.Item>
  );
};

export default ImageField;
