"use client";

import React, { useState, useEffect } from "react";
import { Table as AntdTable, Input, TableProps } from "antd";
import {
  FilterOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Button from "../Button";

type DataTableProps<T extends object> = {
  columns: TableProps<T>["columns"];
  data: T[];
  rowKey: TableProps<T>["rowKey"];
  title?: React.ReactNode;
  extra?: React.ReactNode;
  loading?: boolean;
  pagination?: TableProps<T>["pagination"];
  onChange?: TableProps<T>["onChange"];
  rowSelection?: TableProps<T>["rowSelection"];
  scroll?: TableProps<T>["scroll"];
  size?: TableProps<T>["size"];
  onAddButtonClick?: () => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  onOpenFilter?: () => void;
  onRefresh?: () => void;
};

function DataTable<T extends object>({
  columns,
  data,
  rowKey,
  title,
  extra,
  loading,
  pagination = { pageSize: 5, showSizeChanger: true },
  onChange,
  rowSelection,
  scroll,
  size = "small",
  onAddButtonClick,
  searchable = false,
  searchPlaceholder = "Search…",
  onSearch,
  onOpenFilter,
  onRefresh,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // compute the nearest multiple of 5 from data.length
  const maxOption = Math.ceil((data?.length || 0) / 5) * 5 || 5;

  // generate multiples of 5, min 5, max equals total data length
  const pageSizeOptions = Array.from(
    { length: Math.ceil(maxOption / 5) },
    (_, i) => `${(i + 1) * 5}`
  );

  // Debounce input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (onSearch) onSearch(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <div className="w-full rounded-xl border border-light-muted bg-surface p-4 shadow-sm mx-auto">
      {title && (
        <h2 className="text-lg font-semibold text-dark mb-2">{title}</h2>
      )}

      {(searchable || extra || onRefresh) && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button
              type="primary"
              variant="primary"
              icon={<PlusCircleOutlined />}
              onClick={onAddButtonClick}
            >
              Add
            </Button>
            {onRefresh && (
              <Button
                icon={<ReloadOutlined />}
                onClick={onRefresh}
                className="!bg-surface !text-dark border"
              >
                Refresh
              </Button>
            )}
          </div>

          <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
            {onSearch && (
              <Input
                allowClear
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                prefix={<SearchOutlined />}
                className="sm:w-64 !bg-surface !text-dark"
              />
            )}
            {onOpenFilter && (
              <Button
                icon={<FilterOutlined />}
                onClick={onOpenFilter} // callback to parent
                className="!bg-surface !text-dark border"
              >
                {""}
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="relative">
        {/* <div className="pointer-events-none absolute top-0 left-0 h-full w-6 bg-gradient-to-r from-surface to-transparent z-10" />
        <div className="pointer-events-none absolute top-0 right-0 h-full w-6 bg-gradient-to-l from-surface to-transparent z-10" /> */}

        <AntdTable<T>
          columns={columns}
          dataSource={data}
          rowKey={rowKey}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions,
          }}
          onChange={onChange}
          rowSelection={rowSelection}
          scroll={{
            x: "max-content",
            y: 250,
            ...scroll,
          }}
          size={size}
          className="dashboard-table custom-thin-scrollbar"
        />
      </div>
    </div>
  );
}

export default DataTable;