"use client";

import React from "react";
import { Form } from "antd";

interface FormLayoutProps {
  left: React.ReactNode; // field di sisi kiri
  right?: React.ReactNode; // field di sisi kanan (opsional)
  bottom?: React.ReactNode; // tombol action
}

export default function FormLayout({ left, right, bottom }: FormLayoutProps) {
  return (
    <div className="w-full space-y-0 md:space-y-8">
      <div className="w-full flex flex-col md:flex-row gap-0 md:gap-12 xl:gap-20">
        <div className="md:w-3/5 space-y-8">{left}</div>
        <div className="md:w-2/5 space-y-8">{right}</div>
      </div>

      {bottom && (
        <div>
          <Form.Item>{bottom}</Form.Item>
        </div>
      )}
    </div>
  );
}
