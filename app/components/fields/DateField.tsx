"use client";

import { Form, DatePicker } from "antd";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";
import get from "lodash.get";
import Label from "./Label";

interface DateFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  errors?: Record<string, any>;
  required?: boolean;
  readonly?: boolean;
  showTime?: boolean; // kalau mau langsung date + time
  onChange?: (value: Date | null) => void;
}

const DateField = ({
  control,
  name,
  label,
  placeholder,
  errors,
  required,
  readonly,
  showTime = false,
  onChange,
}: DateFieldProps) => {
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
          <DatePicker
            {...field}
            value={field.value ? dayjs(field.value) : null}
            onChange={(date) => {
              const val = date ? date.toDate() : null;
              field.onChange(val);
              onChange?.(val);
            }}
            placeholder={placeholder}
            size="large"
            disabled={readonly}
            format={showTime ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD"}
            showTime={showTime}
            style={{ width: "100%" }}
          />
        )}
      />
    </Form.Item>
  );
};

export default DateField;
