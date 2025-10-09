"use client";

import React, { useEffect, useRef, useState } from "react";
import { message } from "antd";
import { useToast } from "@/app/hooks/use-toast";
import Table from "@/app/components/shared/table/Table";
import { useRouter } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import { MaterialOverviewResponse } from "@/app/interface/materials/responses/IMaterialOverviewResponse";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import RowActions from "@/app/components/shared/table/RowActions";
import { ColumnType } from "antd/es/table";
import { materialProvider } from "@/app/functions/MaterialProvider";
import { DeleteConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { FilterModal } from "@/app/components/modals/FilterModal";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";
import { GradeOverviewResponse } from "@/app/interface/grades/responses/IGradeOverviewResponse";
import { FormRef } from "@/app/interface/forms/IFormRef";
import { subjectProvider } from "@/app/functions/SubjectProvider";
import { gradeProvider } from "@/app/functions/GradeProvider";
import { FilterMaterialFormInputs } from "@/app/schemas/materials/filterMaterial";
import FilterMaterialForm from "@/app/components/forms/materials/filter-material-form";

const MaterialPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [materials, setMaterials] = useState<MaterialOverviewResponse[]>([]);
  const [subjectData, setSubjectData] = useState<SubjectOverviewResponse[]>([]);
  const [gradeData, setGradeData] = useState<GradeOverviewResponse[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [deleteMaterialId, setDeleteMaterialId] = useState<string | null>(null);
  const [deleteMaterialName, setDeleteMaterialName] = useState<string | null>(
    null
  );
  const [
    isDeleteConfirmationModalVisible,
    setIsDeleteConfirmationModalVisible,
  ] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const formRef = useRef<FormRef>(null);

  const fetchMaterials = async (values?: FilterMaterialFormInputs) => {
    setIsLoading(true);
    const res = await materialProvider.getMaterials(values);

    if (res.isSuccess && res.data) {
      setMaterials(
        res.data.map((m: MaterialOverviewResponse, idx: number) => ({
          key: m.materialId ?? idx,
          ...m,
        }))
      );
    } else {
      message.error("Gagal memuat materi");
    }
    setIsLoading(false);
  };

  const fetchSubjects = async () => {
    const res = await subjectProvider.getSubjects();
    if (res.isSuccess && res.data) setSubjectData(res.data);
  };

  const fetchGrades = async () => {
    const res = await gradeProvider.getGrades();
    if (res.isSuccess && res.data) setGradeData(res.data);
  };

  const handleOpenFilter = () => setIsFilterModalVisible(true);
  const handleCloseFilter = () => setIsFilterModalVisible(false);

  const handleApplyFilter = (values: FilterMaterialFormInputs) => {
    fetchMaterials(values);
    setIsFilterModalVisible(false);
  };

  const handleNavigateToCreateMaterialPage = () => {
    router.push("/dashboard/material/create");
  };

  const handleView = (slug: string) => {
    router.push(`/dashboard/material/${slug}`);
  };

  const handleEdit = (slug: string) => {
    router.push(`/dashboard/material/edit/${slug}`);
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
    try {
      const res = await materialProvider.deleteMaterial(id);
      if (res.isSuccess) {
        toast.success("Materi berhasil dihapus");
        fetchMaterials();
      } else {
        toast.error(res.message || "Gagal menghapus materi");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Terjadi kesalahan saat menghapus materi");
      }
    }
  };

  useEffect(() => {
    fetchMaterials();
    fetchSubjects();
    fetchGrades();
  }, []);

  // Kolom tabel
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
      title: "Nama",
      dataIndex: "name",
      key: "name",
      width: 300,
      onCell: () => ({
        style: { minWidth: 300 },
      }),
    },
    {
      title: "Mata Pelajaran",
      key: "subject",
      width: 300,
      render: (_, record) => record.subject || "-",
      onCell: () => ({
        style: { minWidth: 300 },
      }),
    },
    {
      title: "Kelas",
      key: "grade",
      width: 150,
      render: (_, record) => record.materialGrade || "-",
      onCell: () => ({
        style: { minWidth: 150 },
      }),
    },
    {
      title: "Aksi",
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
      <DashboardTitle title="Daftar Materi Pelajaran" showBackButton={false} />

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
        searchPlaceholder="Cari materi pelajaran…"
        onSearch={(value) => fetchMaterials({ searchText: value })}
        onOpenFilter={handleOpenFilter}
        onRefresh={() => fetchMaterials()}
      />

      <FilterModal
        visible={isFilterModalVisible}
        title="Filter Materi Pelajaran"
        formId="filter-material-form"
        onCancel={handleCloseFilter}
        onResetFilters={() => {
          if (formRef.current?.resetForm) formRef.current?.resetForm(); // reset form pakai ref
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
        modalText={`Apakah kamu yakin ingin menghapus materi pelajaran dengan nama '${deleteMaterialName}'?`}
        onConfirm={confirmDeleteMaterial}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default MaterialPage;
