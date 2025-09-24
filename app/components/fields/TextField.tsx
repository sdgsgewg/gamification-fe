"use client";

import { Form, Input } from "antd";
import { Controller } from "react-hook-form";
import get from "lodash.get";

interface TextFieldProps {
  control: any;
  name: string;
  label?: string;
  placeholder?: string;
  errors?: Record<string, any>;
  required?: boolean;
  readonly?: boolean;
  prefixIcon?: React.ReactNode;
}

const TextField = ({
  control,
  name,
  label,
  placeholder,
  errors,
  required,
  readonly,
  prefixIcon,
}: TextFieldProps) => {
  const error = get(errors, name);

  return (
    <Form.Item
      label={
        label && (
          <span className="text-base font-medium">
            {label}{" "}
            {!readonly &&
              (required ? (
                <span className="text-red-500">*</span>
              ) : (
                <span className="text-gray-500">(opsional)</span>
              ))}
          </span>
        )
      }
      name={name}
      validateStatus={error ? "error" : ""}
      help={error?.message}
      style={{ marginBottom: error ? "1rem" : "0rem" }}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            prefix={prefixIcon}
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
