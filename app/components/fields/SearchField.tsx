"use client";

import { Form, Input } from "antd";
import { Controller } from "react-hook-form";
import Button from "../shared/Button";
import { SearchOutlined } from "@ant-design/icons";

interface SearchFieldProps {
  control: any;
  name: string;
  placeholder?: string;
  formId: string;
  className?: string;
  inputClassName?: string;
}

const SearchField = ({
  control,
  name,
  placeholder,
  formId,
  className,
  inputClassName,
}: SearchFieldProps) => {
  return (
    <Form.Item name={name} style={{ marginBottom: "0rem" }}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className={`flex ${className}`}>
            <Input
              {...field}
              placeholder={placeholder}
              size="large"
              className={`${inputClassName} !rounded-r-none`}
            />
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              variant="primary"
              hasBorder
              size="large"
              className={`${inputClassName} !border-l-0 !rounded-l-none `}
              form={formId}
            >
              <SearchOutlined />
            </Button>
          </div>
        )}
      />
    </Form.Item>
  );
};

export default SearchField;
