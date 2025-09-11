"use client";

import { Form, Input } from "antd";
import { Controller } from "react-hook-form";

interface TextFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  errors?: Record<string, any>;
  required?: boolean;
  readonly?: boolean;
}

const TextField = ({
  control,
  name,
  label,
  placeholder,
  errors,
  required,
  readonly,
}: TextFieldProps) => {
  return (
    <Form.Item
      label={
        <span className="text-base font-medium">
          {label}{" "}
          {!readonly &&
            (required ? (
              <span className="text-red-500">*</span>
            ) : (
              <span className="text-gray-500">(opsional)</span>
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
          <Input
            {...field}
            placeholder={placeholder}
            size="large"
            readOnly={readonly}
          />
        )}
      />
    </Form.Item>
  );
};

export default TextField;
