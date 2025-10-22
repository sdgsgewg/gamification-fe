"use client";

import { Form, Input } from "antd";
import { Controller } from "react-hook-form";
import get from "lodash.get";
import Label from "./Label";

interface TextAreaFieldProps {
  control: any;
  name: string;
  label?: string;
  placeholder?: string;
  errors?: Record<string, any>;
  required?: boolean;
  readonly?: boolean;
  minRows?: number;
  maxRows?: number;
  onChange?: (value: string) => void;
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
  onChange,
}: TextAreaFieldProps) => {
  const error = get(errors, name);

  return (
    <Form.Item
      label={
        label && <Label label={label} required={required} readonly={readonly} />
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
          <Input.TextArea
            {...field}
            placeholder={placeholder}
            size="large"
            autoSize={{ minRows, maxRows }}
            readOnly={readonly}
            onChange={(e) => {
              field.onChange(e);
              onChange?.(e.target.value);
            }}
          />
        )}
      />
    </Form.Item>
  );
};

export default TextAreaField;
