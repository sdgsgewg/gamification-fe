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
  onChange?: (value: string) => void;
}

const TextField = ({
  control,
  name,
  label,
  placeholder,
  errors,
  required,
  readonly,
  onChange,
}: TextFieldProps) => {
  const error = get(errors, name);

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
            placeholder={placeholder}
            size="large"
            readOnly={readonly}
            // onChange={(e) => {
            //   field.onChange(e);
            //   onChange?.(field.value);
            // }}
          />
        )}
      />
    </Form.Item>
  );
};

export default TextField;
