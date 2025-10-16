"use client";

import React, { useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { Toaster, useToast } from "@/app/hooks/use-toast";
import { MaterialOverviewResponse } from "@/app/interface/materials/responses/IMaterialOverviewResponse";
import Loading from "@/app/components/shared/Loading";
import DetailPageWrapper from "@/app/components/shared/detail-page/DetailPageWrapper";
import { ColumnType } from "antd/es/table";
import DataTable from "@/app/components/shared/table/Table";
import { DeleteConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import {
  DetailInformationTable,
  HistoryTable,
} from "@/app/components/shared/table/detail-page/TableTemplate";
import { SubjectRow } from "@/app/components/shared/table/detail-page/TableRowData";
import DetailPageLeftSideContent from "@/app/components/shared/detail-page/DetailPageLeftSideContent";
import { ROUTES } from "@/app/constants/routes";
import { useMaterials } from "@/app/hooks/materials/useMaterials";
import { useSubjectDetail } from "@/app/hooks/subjects/useSubjectDetail";
import { useDeleteSubject } from "@/app/hooks/subjects/useDeleteSubject";

const SubjectDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const { toast } = useToast();
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.ADMIN.MANAGE_SUBJECTS;

  const { data: subjectData, isLoading } = useSubjectDetail(
    params.slug,
    "detail"
  );
  const { mutateAsync: deleteSubject } = useDeleteSubject();
  const { data: materials = [] } = useMaterials({
    subjectId: subjectData?.subjectId,
  });

  const [deleteSubjectId, setDeleteSubjectId] = useState<string | null>(null);
  const [deleteSubjectName, setDeleteSubjectName] = useState<string | null>(
    null
  );
  const [
    isDeleteConfirmationModalVisible,
    setIsDeleteConfirmationModalVisible,
  ] = useState(false);

  const handleEdit = (slug: string) => {
    router.push(`${baseRoute}/edit/${slug}`);
  };

  const showDeleteModal = (subjectId: string, name: string) => {
    setDeleteSubjectId(subjectId);
    setDeleteSubjectName(name);
    setIsDeleteConfirmationModalVisible(true);
  };

  const confirmDeleteSubject = () => {
    if (deleteSubjectId !== null) {
      handleDelete(deleteSubjectId);
      setDeleteSubjectId(null);
      setDeleteSubjectName(null);
      setIsDeleteConfirmationModalVisible(false);
    }
  };

  const cancelDelete = () => {
    setDeleteSubjectId(null);
    setDeleteSubjectName(null);
    setIsDeleteConfirmationModalVisible(false);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteSubject(id);
    const { isSuccess, message } = res;
    if (isSuccess) {
      toast.success(message ?? "Mata pelajaran berhasil dihapus");
      router.push(`${baseRoute}`);
    } else {
      toast.error(message ?? "Gagal menghapus mata pelajaran");
    }
  };

  if (!subjectData) {
    return <Loading />;
  }

  const LeftSideContent = () => {
    const { name, image, description } = subjectData;
    return (
      <DetailPageLeftSideContent
        name={name}
        image={image}
        description={description}
      />
    );
  };

  const RightSideContent = () => {
    const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 5,
    });

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
        width: 250,
        onCell: () => ({
          style: { minWidth: 250 },
        }),
      },
      {
        title: "Kelas",
        key: "materialGrade",
        width: 200,
        render: (_, record) => record.materialGrade || "-",
        onCell: () => ({
          style: { minWidth: 200 },
        }),
      },
    ];

    return (
      <>
        {/* Informasi Detail */}
        <DetailInformationTable>
          <SubjectRow value={subjectData.name} />
        </DetailInformationTable>

        {/* Riwayat */}
        <HistoryTable
          createdBy={subjectData.createdBy}
          updatedBy={subjectData.updatedBy}
        />

        {/* Daftar Materi */}
        {materials && materials.length > 0 && (
          <DataTable
            columns={columns}
            data={materials}
            rowKey="key"
            title="Daftar Materi"
            loading={isLoading}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                setPagination({ current: page, pageSize });
              },
            }}
          />
        )}
      </>
    );
  };

  return (
    <>
      {isLoading && <Loading />}

      <Toaster position="top-right" />
      <DashboardTitle
        showBackButton={true}
        onEdit={() => {
          if (subjectData) handleEdit(subjectData.slug);
        }}
        onDelete={() => {
          if (subjectData)
            showDeleteModal(subjectData.subjectId, subjectData.name);
        }}
      />
      {subjectData && (
        <DetailPageWrapper
          left={<LeftSideContent />}
          right={<RightSideContent />}
        />
      )}

      <DeleteConfirmationModal
        visible={isDeleteConfirmationModalVisible}
        modalText={`Apakah kamu yakin ingin menghapus materi pelajaran dengan nama '${deleteSubjectName}'?`}
        onConfirm={confirmDeleteSubject}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default SubjectDetailPage;
