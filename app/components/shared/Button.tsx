"use client";

import React from "react";
import { Button as AntdButton } from "antd";
import type { ButtonProps } from "antd";

export type ButtonVariant = "primary" | "view" | "edit" | "delete";

interface CustomButtonProps extends ButtonProps {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<CustomButtonProps> = ({
  variant = "",
  className = "",
  children,
  ...props
}) => {
  let variantClassName = "";

  switch (variant) {
    case "primary":
      variantClassName =
        "!bg-[#556FD7] hover:!bg-[#4559B5] !text-white !border-none";
      break;
    case "view":
      variantClassName =
        "!bg-[#74C1FF] hover:!bg-[#4FA8F8] !text-black !border-none";
      break;
    case "edit":
      variantClassName =
        "!bg-[#FFC107] hover:!bg-[#E0A800] !text-black !border-none";
      break;
    case "delete":
      variantClassName =
        "!bg-[#DC3545] hover:!bg-[#B02A37] !text-white !border-none";
      break;
  }

  return (
    <AntdButton
      className={`${variantClassName} !flex !items-center !justify-center !font-semibold !transition !duration-300 !ease-in-out ${className}`}
      {...props}
    >
      {children}
    </AntdButton>
  );
};

export default Button;
