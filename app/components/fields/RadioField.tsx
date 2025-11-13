"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { Form, Radio, RadioChangeEvent, Space } from "antd";
import get from "lodash.get";
import Label from "./Label";

interface Option {
  value: string | number | boolean;
  label: string;
}

interface RadioFieldProps {
  control: any;
  name: string;
  label?: string;
  placeholder?: string;
  size?: "small" | "middle" | "large";
  options?: Option[];
  errors?: Record<string, any>;
  disabled?: boolean;
  required?: boolean;
  value?: string | number | boolean; // For individual radio buttons
  onChange?: (e: RadioChangeEvent) => void; // For individual radio buttons
}

const RadioField: React.FC<RadioFieldProps> = ({
  name,
  control,
  label,
  placeholder = "Pilih Opsi",
  size = "large",
  options = [],
  errors,
  disabled = false,
  required = false,
  value, // For individual radio buttons
  onChange, // For individual radio buttons
}) => {
  const error = get(errors, name);

  // If this is being used as an individual radio button (not in a group)
  const isIndividualButton = !options || options.length === 0;

  return (
    <Form.Item
      label={label && <Label label={label} required={required} />}
      validateStatus={error ? "error" : ""}
      help={error?.message}
      style={{ marginBottom: error ? "1rem" : "0rem" }}
      required={required}
    >
      {isIndividualButton ? (
        // Individual radio button
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Radio
              {...field}
              checked={field.value === value}
              onChange={(e) => {
                field.onChange(e);
                onChange?.(e);
              }}
              disabled={disabled}
              value={value}
            >
              {placeholder}
            </Radio>
          )}
        />
      ) : (
        // Radio group with options
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Radio.Group
              {...field}
              value={field.value}
              onChange={(e) => {
                field.onChange(e);
                onChange?.(e);
              }}
              disabled={disabled}
              size={size}
            >
              <Space direction="vertical">
                {options.map((option) => (
                  <Radio key={String(option.value)} value={option.value}>
                    {option.label}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          )}
        />
      )}
    </Form.Item>
  );
};

export default RadioField;
