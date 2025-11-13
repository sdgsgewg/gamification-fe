"use client";

import { Form, InputNumber } from "antd";
import { Controller } from "react-hook-form";
import get from "lodash.get";
import Label from "./Label";

interface NumberFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  errors?: Record<string, any>;
  required?: boolean;
  readonly?: boolean;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number | undefined) => void;
}

const NumberField = ({
  control,
  name,
  label,
  placeholder,
  errors,
  required,
  readonly,
  min,
  max,
  step,
  onChange,
}: NumberFieldProps) => {
  const error = get(errors, name);

  return (
    <Form.Item
      label={
        label && <Label label={label} required={required} readonly={readonly} />
      }
      validateStatus={error ? "error" : ""}
      help={error?.message}
      style={{ marginBottom: error ? "1rem" : "0rem" }}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <InputNumber
            {...field}
            placeholder={placeholder}
            size="large"
            readOnly={readonly}
            min={min}
            max={max}
            step={step}
            style={{ width: "100%" }}
            // Convert undefined to null for InputNumber compatibility
            // value={field.value === undefined ? null : field.value}
            value={field.value ?? undefined}
            onChange={(value) => {
              const val =
                value === null || value === "" ? undefined : Number(value);
              field.onChange(val);
              onChange?.(val);
            }}
          />
        )}
      />
    </Form.Item>
  );
};

export default NumberField;
