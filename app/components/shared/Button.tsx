"use client";

import React from "react";
import { Button as AntdButton } from "antd";
import type { ButtonProps } from "antd";

export type ButtonVariant =
  | "primary"
  | "outline"
  | "view"
  | "warning"
  | "danger";

interface CustomButtonProps extends ButtonProps {
  variant?: ButtonVariant;
  hasBorder?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<CustomButtonProps> = ({
  variant = "",
  hasBorder = false,
  className = "",
  children,
  ...props
}) => {
  let variantClassName = "";

  switch (variant) {
    case "primary":
      variantClassName = `!bg-primary hover:!bg-primary-hover !text-white ${
        hasBorder ? "" : "!border-none"
      }`;
      break;
    case "outline":
      variantClassName =
        "!bg-outline hover:!bg-outline-hover !text-tx-primary-accent !border !border-br-primary";
      break;
    case "view":
      variantClassName = `!bg-view hover:!bg-view-hover !text-black ${
        hasBorder ? "" : "!border-none"
      }`;
      break;
    case "warning":
      variantClassName = `!bg-warning hover:!bg-warning-hover !text-black ${
        hasBorder ? "" : "!border-none"
      }`;
      break;
    case "danger":
      variantClassName = `!bg-danger hover:!bg-danger-hover !text-white ${
        hasBorder ? "" : "!border-none"
      }`;
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
