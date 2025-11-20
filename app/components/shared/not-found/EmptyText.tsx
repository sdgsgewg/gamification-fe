import React from "react";

interface EmptyTextProps {
  text: string;
}

const EmptyText = ({ text }: EmptyTextProps) => {
  return <p className="text-tx-tertiary text-sm">{text}</p>;
};

export default EmptyText;
