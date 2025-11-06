"use client";

import React, { useEffect, useRef, useState } from "react";
import { Toaster } from "@/app/hooks/use-toast";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useUserClasses } from "@/app/hooks/classes/useUserClasses";
import Button from "@/app/components/shared/Button";
import { PlusCircleOutlined } from "@ant-design/icons";
import SearchField from "@/app/components/fields/SearchField";
import { useForm } from "react-hook-form";
import { Form } from "antd";
import { useNotJoinedClasses } from "@/app/hooks/classes/useNotJoinedClasses";
import { JoinClassModal } from "@/app/components/modals/JoinClassModal";
import JoinClassForm from "@/app/components/forms/classes/join-class-form";
import { FormRef } from "@/app/interface/forms/IFormRef";
import {
  ClassCard,
  ClassCardSkeleton,
  ClassCardWrapper,
} from "@/app/components/pages/Dashboard/Class/Cards";

const StudentClassPage = () => {
  const [isJoinClassModalVisible, setIsJoinClassModalVisible] = useState(false);

  const { data: notJoinedClasses = [], isLoading: isNotJoinedClassesLoading } =
    useNotJoinedClasses();

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

  const formRef = useRef<FormRef>(null);

  const handleOpenJoinClassModal = () => setIsJoinClassModalVisible(true);
  const handleCloseJoinClassModal = () => setIsJoinClassModalVisible(false);

  const handleJoinClass = () => {};

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
          onClick={handleOpenJoinClassModal}
        >
          Join
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
            <ClassCard key={c.id} image={c.image} name={c.name} slug={c.slug} />
          ))}
        </ClassCardWrapper>
      ) : (
        <p className="text-center">Class not found.</p>
      )}

      {/* Join Class Modal */}
      <JoinClassModal
        visible={isJoinClassModalVisible}
        title="Gabung Kelas"
        formId="join-class-form"
        onCancel={handleCloseJoinClassModal}
        onResetFilters={() => {
          if (formRef.current?.resetForm) formRef.current?.resetForm(); // reset form pakai ref
        }}
      >
        <JoinClassForm
          ref={formRef}
          classData={notJoinedClasses}
          onFinish={handleJoinClass}
        />
      </JoinClassModal>
    </>
  );
};

export default StudentClassPage;
