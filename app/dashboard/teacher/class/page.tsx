"use client";

import React, { useEffect, useState } from "react";
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
import { Form } from "antd";
import ClassCardSkeleton from "@/app/components/pages/Dashboard/Class/Cards/ClassCard/Skeleton";

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
    pageSize: 5,
  });

  const handleNavigateToCreateClassPage = () => {
    router.push(`${baseRoute}/create`);
  };

  const handleNavigateToClassDetailPage = (slug: string) => {
    router.push(`${baseRoute}/${slug}`);
  };

  return (
    <>
      <Toaster position="top-right" />
      <DashboardTitle title="Kelas Saya" showBackButton={false} />

      {/* Add and search content */}
      <div className="flex items-center gap-4 md:gap-12 mb-12">
        <Button
          type="primary"
          variant="primary"
          size="large"
          icon={<PlusCircleOutlined />}
          onClick={handleNavigateToCreateClassPage}
        >
          Tambah
        </Button>

        {/* Search Field mengambil sisa ruang */}
        <div className="flex-1">
          <Form id="filter-class-form">
            <SearchField
              control={control}
              name="searchText"
              placeholder="Cari berdasarkan nama..."
              formId="filter-class-form"
              inputClassName="!px-6 !rounded-3xl"
            />
          </Form>
        </div>
      </div>

      {/* Class Grid */}
      {isLoading ? (
        <ClassCardWrapper>
          {Array.from({ length: 4 }).map((_, idx) => (
            <ClassCardSkeleton key={idx} />
          ))}
        </ClassCardWrapper>
      ) : classes.length > 0 ? (
        <ClassCardWrapper>
          {classes.map((c) => (
            <ClassCard
              key={c.id}
              image={c.image}
              name={c.name}
              onClick={() => handleNavigateToClassDetailPage(c.slug)}
            />
          ))}
        </ClassCardWrapper>
      ) : (
        <p className="text-center">Class not found.</p>
      )}
    </>
  );
};

export default TeacherClassPage;
