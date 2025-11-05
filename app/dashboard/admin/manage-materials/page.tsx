"use client";

import React, { useRef, useState } from "react";
import { useToast } from "@/app/hooks/use-toast";
import Table from "@/app/components/shared/table/Table";
import { useRouter } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import { MaterialOverviewResponse } from "@/app/interface/materials/responses/IMaterialOverviewResponse";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import RowActions from "@/app/components/shared/table/RowActions";
import { ColumnType } from "antd/es/table";
import { DeleteConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { FilterModal } from "@/app/components/modals/FilterModal";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { FilterMaterialFormInputs } from "@/app/schemas/materials/filterMaterial";
import FilterMaterialForm from "@/app/components/forms/materials/filter-material-form";
import { ROUTES } from "@/app/constants/routes";
import { useMaterials } from "@/app/hooks/materials/useMaterials";
import { useDeleteMaterial } from "@/app/hooks/materials/useDeleteMaterial";
import { useSubjects } from "@/app/hooks/subjects/useSubjects";
import { useGrades } from "@/app/hooks/grades/useGrades";

const MaterialPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.ADMIN.MANAGE_MATERIALS;

  const [filters, setFilters] = useState<FilterMaterialFormInputs>({
    searchText: "",
  });
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const { data: materials = [], isLoading, refetch } = useMaterials(filters);
  const { mutateAsync: deleteMaterial } = useDeleteMaterial();
  const { data: subjectData = [] } = useSubjects();
  const { data: gradeData = [] } = useGrades();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  const [deleteMaterialId, setDeleteMaterialId] = useState<string | null>(null);
  const [deleteMaterialName, setDeleteMaterialName] = useState<string | null>(null);
  const [isDeleteConfirmationModalVisible, setIsDeleteConfirmationModalVisible] =
    useState(false);

  const formRef = useRef<FormRef>(null);

  const handleOpenFilter = () => setIsFilterModalVisible(true);
  const handleCloseFilter = () => setIsFilterModalVisible(false);

  const handleApplyFilter = (values: FilterMaterialFormInputs) => {
    setFilters((prev) => ({
      ...prev,
      ...values, // merge new filters with search text
    }));
    setIsFilterModalVisible(false);
  };

  const handleNavigateToCreateMaterialPage = () => {
    router.push(`${baseRoute}/create`);
  };

  const handleView = (slug: string) => {
    router.push(`${baseRoute}/${slug}`);
  };

  const handleEdit = (slug: string) => {
    router.push(`${baseRoute}/edit/${slug}`);
  };

  const showDeleteModal = (materialId: string, name: string) => {
    setDeleteMaterialId(materialId);
    setDeleteMaterialName(name);
    setIsDeleteConfirmationModalVisible(true);
  };

  const confirmDeleteMaterial = () => {
    if (deleteMaterialId !== null) {
      handleDelete(deleteMaterialId);
      setDeleteMaterialId(null);
      setDeleteMaterialName(null);
      setIsDeleteConfirmationModalVisible(false);
    }
  };

  const cancelDelete = () => {
    setDeleteMaterialId(null);
    setDeleteMaterialName(null);
    setIsDeleteConfirmationModalVisible(false);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteMaterial(id);
    const { isSuccess, message } = res;
    if (isSuccess) {
      toast.success(message ?? "Material deleted successfully");
      refetch();
    } else {
      toast.error(message ?? "Failed to delete material");
    }
  };

  // Table columns
  const columns: ColumnType<MaterialOverviewResponse>[] = [
    {
      title: "No",
      key: "index",
      width: 50,
      align: "center",
      fixed: "left",
      render: (_: unknown, __: MaterialOverviewResponse, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 300,
      onCell: () => ({
        style: { minWidth: 300 },
      }),
    },
    {
      title: "Subject",
      key: "subject",
      width: 300,
      render: (_, record) => record.subject || "-",
      onCell: () => ({
        style: { minWidth: 300 },
      }),
    },
    {
      title: "Class",
      key: "grade",
      width: 150,
      render: (_, record) => record.materialGrade || "-",
      onCell: () => ({
        style: { minWidth: 150 },
      }),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <RowActions
          onView={() => handleView(record.slug)}
          onEdit={() => handleEdit(record.slug)}
          onDelete={() => showDeleteModal(record.materialId, record.name)}
        />
      ),
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <DashboardTitle title="Materials List" showBackButton={false} />

      <Table
        columns={columns}
        data={materials}
        rowKey="key"
        loading={isLoading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize });
          },
        }}
        onAddButtonClick={handleNavigateToCreateMaterialPage}
        searchable
        searchPlaceholder="Search materials…"
        onSearch={(value) =>
          setFilters((prev) => ({ ...prev, searchText: value }))
        }
        onOpenFilter={handleOpenFilter}
        onRefresh={() => refetch()}
      />

      <FilterModal
        visible={isFilterModalVisible}
        title="Filter Materials"
        formId="filter-material-form"
        onCancel={handleCloseFilter}
        onResetFilters={() => {
          if (formRef.current?.resetForm) formRef.current?.resetForm(); // reset form using ref
        }}
      >
        <FilterMaterialForm
          ref={formRef}
          subjectData={subjectData}
          gradeData={gradeData}
          onFinish={handleApplyFilter}
        />
      </FilterModal>

      <DeleteConfirmationModal
        visible={isDeleteConfirmationModalVisible}
        modalText={`Are you sure you want to delete the material named '${deleteMaterialName}'?`}
        onConfirm={confirmDeleteMaterial}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default MaterialPage;