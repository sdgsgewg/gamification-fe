"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { Form, Select } from "antd";
import get from "lodash.get";
import Label from "./Label";

interface Option {
  value: string | number | boolean;
  label: string;
}

interface SelectFieldProps {
  control: any;
  name: string;
  label?: string;
  placeholder?: string;
  size?: "small" | "middle" | "large";
  options: Option[];
  errors?: Record<string, any>;
  helpText?: string;
  loading?: boolean;
  disabled?: boolean;
  mode?: "multiple" | "tags";
  required?: boolean;
  className?: string;
  onChange?: (value: string | number | boolean) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  control,
  label,
  placeholder = "Pilih Opsi",
  size = "large",
  options,
  errors,
  helpText,
  loading = false,
  disabled = false,
  mode = undefined, // Default to single select
  required = false,
  className,
  onChange,
}) => {
  const error = get(errors, name);

  return (
    <Form.Item
      label={label && <Label label={label} required={required} />}
      validateStatus={error ? "error" : ""}
      help={error?.message ?? helpText}
      style={{ marginBottom: error ? "1rem" : "0rem" }}
      required={required}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            placeholder={placeholder}
            size={size}
            loading={loading}
            disabled={disabled}
            value={field.value || (mode === "multiple" ? [] : undefined)}
            options={options}
            mode={mode}
            allowClear={mode === "multiple"}
            showSearch
            optionFilterProp="label"
            className={className}
            filterOption={(input, option) =>
              (option?.label as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            onChange={(value) => {
              field.onChange(value);
              onChange?.(value);
            }}
          />
        )}
      />
    </Form.Item>
  );
};

export default SelectField;
