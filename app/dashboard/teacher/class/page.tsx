"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { ROUTES } from "@/app/constants/routes";
import ClassCardWrapper from "@/app/components/pages/Dashboard/Class/Cards/ClassCard/Wrapper";
import { useUserClasses } from "@/app/hooks/classes/useUserClasses";
import ClassCard from "@/app/components/pages/Dashboard/Class/Cards/ClassCard";
import Button from "@/app/components/shared/Button";
import { PlusCircleOutlined } from "@ant-design/icons";
import SearchField from "@/app/components/fields/SearchField";
import { useForm } from "react-hook-form";
import { Form, Pagination } from "antd";
import ClassCardSkeleton from "@/app/components/pages/Dashboard/Class/Cards/ClassCard/Skeleton";
import NotFound from "@/app/components/shared/NotFound";
import PaginationInfo from "@/app/components/shared/PaginationInfo";

const TeacherClassPage = () => {
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.TEACHER.CLASS;

  const { control, watch } = useForm({
    defaultValues: { searchText: "" },
  });
  const searchValue = watch("searchText");

  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchValue]);

  const { data: classes = [], isLoading } = useUserClasses(debouncedSearch);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
  });

  // Compute paginated data
  const paginatedClasses = useMemo(() => {
    const startIdx = (pagination.current - 1) * pagination.pageSize;
    const endIdx = pagination.current * pagination.pageSize;
    return classes.slice(startIdx, endIdx);
  }, [classes, pagination]);

  // Navigation handlers
  const handleNavigateToCreateClassPage = () => {
    router.push(`${baseRoute}/create`);
  };

  const handleNavigateToClassDetailPage = (slug: string) => {
    router.push(`${baseRoute}/${slug}`);
  };

  return (
    <>
      <Toaster position="top-right" />
      <DashboardTitle title="My Class" showBackButton={false} />

      {/* Add + Search */}
      <div className="flex items-center gap-4 md:gap-12 mb-12">
        <Button
          type="primary"
          variant="primary"
          size="large"
          icon={<PlusCircleOutlined />}
          onClick={handleNavigateToCreateClassPage}
        >
          Add
        </Button>

        <div className="flex-1">
          <Form id="filter-class-form">
            <SearchField
              control={control}
              name="searchText"
              placeholder="Search by name..."
              formId="filter-class-form"
              inputClassName="!px-6 !rounded-3xl"
            />
          </Form>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <ClassCardWrapper>
          {Array.from({ length: 4 }).map((_, idx) => (
            <ClassCardSkeleton key={idx} />
          ))}
        </ClassCardWrapper>
      ) : classes.length > 0 ? (
        <>
          <ClassCardWrapper>
            {paginatedClasses.map((c) => (
              <ClassCard
                key={c.id}
                image={c.image}
                name={c.name}
                slug={c.slug}
                onClick={handleNavigateToClassDetailPage}
              />
            ))}
          </ClassCardWrapper>

          {/* Pagination + Display */}
          <PaginationInfo
            total={classes.length}
            pagination={pagination}
            label="classes"
            onChange={(page, pageSize) =>
              setPagination({ current: page, pageSize })
            }
          />
        </>
      ) : (
        <NotFound text="Class Not Found" />
      )}
    </>
  );
};

export default TeacherClassPage;
