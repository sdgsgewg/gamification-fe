"use client";

import React from "react";
import { Pagination } from "antd";

interface Props {
  total: number;
  pagination: {
    current: number;
    pageSize: number;
  };
  onChange: (page: number, pageSize: number) => void;
  label?: string; // classes / tasks / students etc.
  sizeOptions?: string[];
}

const PaginationInfo = ({
  total,
  pagination,
  onChange,
  label = "items",
  sizeOptions = ["5", "10", "20", "50"],
}: Props) => {
  const start =
    total === 0 ? 0 : (pagination.current - 1) * pagination.pageSize + 1;
  const end = Math.min(pagination.current * pagination.pageSize, total);

  return (
    <div className="flex-1 flex flex-col items-start justify-end gap-2">
      <Pagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={total}
        showSizeChanger
        pageSizeOptions={sizeOptions}
        onChange={onChange}
      />

      <p className="text-tx-tertiary text-sm">
        Showing {start}–{end} of {total} {label}
      </p>
    </div>
  );
};

export default PaginationInfo;
