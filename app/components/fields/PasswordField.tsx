"use client";

import { Form, Input } from "antd";
import { Controller } from "react-hook-form";
import { LockOutlined } from "@ant-design/icons";
import get from "lodash.get";
import Label from "./Label";

interface PasswordFieldProps {
  control: any;
  name: string;
  label?: string;
  placeholder?: string;
  errors?: Record<string, any>;
  required?: boolean;
  readonly?: boolean;
  prefixIcon?: React.ReactNode;
}

const PasswordField = ({
  control,
  name,
  label,
  placeholder,
  errors,
  required,
  readonly,
  prefixIcon = <LockOutlined style={{ marginRight: 8 }} />,
}: PasswordFieldProps) => {
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
          <Input.Password
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

export default PasswordField;
