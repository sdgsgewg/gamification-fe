"use client";

import { Form, Upload } from "antd";
import { Controller } from "react-hook-form";
import { UploadFile } from "antd/es/upload/interface";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useState } from "react";

interface ImageFieldProps {
  control: any;
  name: string;
  label: string;
  fileList: UploadFile[];
  setFileList: (files: UploadFile[]) => void;
  errors?: Record<string, any>;
  required?: boolean;
  readonly?: boolean;
  setOldImageUrl?: (url?: string) => void; // optional untuk edit form
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
}: ImageFieldProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Form.Item
      label={
        <span className="text-base font-medium">
          {label}{" "}
          {!readonly &&
            (required ? (
              <span className="text-red-500">*</span>
            ) : (
              <span className="text-gray-500">{"(opsional)"}</span>
            ))}
        </span>
      }
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
            showUploadList={false} // kita custom sendiri preview
            fileList={fileList}
            disabled={readonly}
            beforeUpload={(file) => {
              if (readonly) return false;
              const previewUrl = URL.createObjectURL(file);
              setFileList([
                {
                  uid: file.uid,
                  name: file.name,
                  status: "done",
                  url: previewUrl,
                  originFileObj: file,
                },
              ]);
              field.onChange(previewUrl);
              return false; // cegah auto upload
            }}
          >
            {fileList.length > 0 ? (
              <div
                className="relative group w-60 aspect-square"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <Image
                  src={
                    fileList[0].url ||
                    URL.createObjectURL(fileList[0].originFileObj!)
                  }
                  alt={fileList[0].name}
                  width={200}
                  height={200}
                  className="rounded-lg object-cover w-full h-full"
                />

                {/* Overlay saat hover */}
                {hovered && !readonly && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // jangan trigger input file
                        setFileList([]);
                        field.onChange("");
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
              // Default state (belum ada gambar / setelah hapus)
              <div className="flex flex-col items-center justify-center w-60 aspect-square border-2 border-dashed rounded-lg hover:border-blue-500 hover:text-blue-500 transition cursor-pointer">
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
