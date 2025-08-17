"use client";

import React from "react";
import { Button as AntdButton } from "antd";
import type { ButtonProps } from "antd";

type Variant = "primary" | "edit" | "delete";

interface CustomButtonProps extends ButtonProps {
  variant?: Variant;
  label: string;
}

const Button: React.FC<CustomButtonProps> = ({
  variant = "primary",
  label,
  ...props
}) => {
  let className = "";

  switch (variant) {
    case "primary":
      className =
        "!bg-[#556FD7] hover:!bg-[#4559B5] !text-white !border-none !transition !duration-300 !ease-in-out";
      break;
    case "edit":
      className =
        "!bg-[#FFC107] hover:!bg-[#E0A800] !text-black !border-none !transition !duration-300 !ease-in-out";
      break;
    case "delete":
      className =
        "!bg-[#DC3545] hover:!bg-[#B02A37] !text-white !border-none !transition !duration-300 !ease-in-out";
      break;
  }

  return (
    <AntdButton className={`${className}`} {...props}>
      {label}
    </AntdButton>
  );
};

export default Button;
