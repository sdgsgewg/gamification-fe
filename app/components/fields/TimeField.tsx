"use client";

import { Form, TimePicker } from "antd";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";
import get from "lodash.get";
import Label from "./Label";

interface TimeFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  errors?: Record<string, any>;
  required?: boolean;
  readonly?: boolean;
  onChange?: (value: Date | null) => void;
}

const TimeField = ({
  control,
  name,
  label,
  placeholder,
  errors,
  required,
  readonly,
  onChange,
}: TimeFieldProps) => {
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
          <TimePicker
            {...field}
            value={field.value ? dayjs(field.value) : null}
            onChange={(time) => {
              const val = time ? time.toDate() : null;
              field.onChange(val);
              onChange?.(val);
            }}
            placeholder={placeholder}
            size="large"
            disabled={readonly}
            format="HH:mm"
            style={{ width: "100%" }}
          />
        )}
      />
    </Form.Item>
  );
};

export default TimeField;
