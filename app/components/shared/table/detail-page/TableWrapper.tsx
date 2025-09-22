import React from "react";
import { Form } from "antd";

interface TableWrapperProps {
  children: React.ReactNode;
}

export default function TableWrapper({ children }: TableWrapperProps) {
  return (
    <div className="rounded-md border border-[#BCB4FF] overflow-hidden">
      {children}
    </div>
  );
}
