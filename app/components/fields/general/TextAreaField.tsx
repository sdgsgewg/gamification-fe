"use client";

import { Form, Input } from "antd";
import { Controller } from "react-hook-form";

interface TextAreaFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  errors?: Record<string, any>;
  required?: boolean;
  readonly?: boolean;
  minRows?: number;
  maxRows?: number;
}

const TextAreaField = ({
  control,
  name,
  label,
  placeholder,
  errors,
  required,
  readonly,
  minRows = 3,
  maxRows = 6,
}: TextAreaFieldProps) => {
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
          <Input.TextArea
            {...field}
            placeholder={placeholder}
            size="large"
            autoSize={{ minRows, maxRows }}
            readOnly={readonly}
          />
        )}
      />
    </Form.Item>
  );
};

export default TextAreaField;
