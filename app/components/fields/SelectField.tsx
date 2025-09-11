"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { Form, Select } from "antd";

interface Option {
  value: string | number;
  label: string;
}

interface SelectFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  size?: "small" | "middle" | "large";
  options: Option[];
  errors?: Record<string, any>;
  loading?: boolean;
  disabled?: boolean;
  mode?: "multiple" | "tags";
  required?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  control,
  label,
  placeholder = "Pilih Opsi",
  size = "large",
  options,
  errors,
  loading = false,
  disabled = false,
  mode = undefined, // Default to single select
  required = false,
}) => {
  return (
    <Form.Item
      label={
        <span className="font-medium">
          {label}
          {required && <span className="text-red-500">*</span>}
        </span>
      }
      validateStatus={errors ? "error" : ""}
      help={errors?.message}
      style={{ marginBottom: errors ? "2.5rem" : "2rem" }}
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
            filterOption={(input, option) =>
              (option?.label as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        )}
      />
    </Form.Item>
  );
};

export default SelectField;
