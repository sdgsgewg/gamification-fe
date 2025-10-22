import React from "react";

interface TableWrapperProps {
  children: React.ReactNode;
}

export default function TableWrapper({ children }: TableWrapperProps) {
  return (
    <div className="rounded-md border border-br-primary overflow-hidden">
      {children}
    </div>
  );
}
