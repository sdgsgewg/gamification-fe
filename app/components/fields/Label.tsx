import React from "react";

interface LabelProps {
  label: string;
  required?: boolean;
  optional?: boolean;
  readonly?: boolean;
}

const Label = ({ label, required, optional = false, readonly }: LabelProps) => {
  return (
    <span className="flex gap-1 text-base font-medium">
      <span className="text-dark">{label}</span>
      {!readonly &&
        (required ? (
          <span className="text-red-500">*</span>
        ) : optional ? (
          <span className="text-gray-500">{"(opsional)"}</span>
        ) : null)}
    </span>
  );
};

export default Label;
