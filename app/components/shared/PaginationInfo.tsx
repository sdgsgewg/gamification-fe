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
  const start = total === 0 ? 0 : (pagination.current - 1) * pagination.pageSize + 1;
  const end = Math.min(pagination.current * pagination.pageSize, total);

  return (
    <div className="flex flex-col items-end gap-2 mt-12">
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
