"use client";

import React, { useEffect, useState } from "react";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import { useRouter, useParams } from "next/navigation";
import { subjectProvider } from "@/app/functions/SubjectProvider";
import { message } from "antd";
import { Toaster, useToast } from "@/app/hooks/use-toast";
import { SubjectDetailResponse } from "@/app/interface/subjects/responses/ISubjectDetailResponse";
import { MaterialOverviewResponse } from "@/app/interface/materials/responses/IMaterialOverviewResponse";
import Loading from "@/app/components/shared/Loading";
import DetailPageWrapper from "@/app/components/pages/Dashboard/DetailPageWrapper";
import { materialProvider } from "@/app/functions/MaterialProvider";
import { ColumnType } from "antd/es/table";
import DataTable from "@/app/components/shared/table/Table";
import { DeleteConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import {
  DetailInformationTable,
  HistoryTable,
} from "@/app/components/shared/table/detail-page/TableTemplate";
import { SubjectRow } from "@/app/components/shared/table/detail-page/TableRowData";
import { getImageSrc } from "@/app/utils/image";
import DetailPageLeftSideContent from "@/app/components/pages/Dashboard/DetailPageLeftSideContent";
import { ROUTES } from "@/app/constants/routes";

const SubjectDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [subjectData, setSubjectData] = useState<SubjectDetailResponse | null>(
    null
  );
  const [materials, setMaterials] = useState<MaterialOverviewResponse[]>([]);
  const [deleteSubjectId, setDeleteSubjectId] = useState<string | null>(null);
  const [deleteSubjectName, setDeleteSubjectName] = useState<string | null>(
    null
  );
  const [
    isDeleteConfirmationModalVisible,
    setIsDeleteConfirmationModalVisible,
  ] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.ADMIN.MANAGE_SUBJECTS;

  const fetchSubjectDetail = async () => {
    setIsLoading(true);
    const res = await subjectProvider.getSubject(params.slug);
    if (res.isSuccess && res.data) {
      const s = res.data;
      setSubjectData({
        subjectId: s.subjectId,
        name: s.name,
        slug: s.slug,
        description: s.description ?? "",
        image: s.image ? getImageSrc(s.image) : "",
        createdBy: s.createdBy,
        updatedBy: s.updatedBy ?? "-",
      });
    } else {
      message.error("Gagal memuat detail mata pelajaran");
      router.push(`${baseRoute}`);
    }
    setIsLoading(false);
  };

  const fetchMaterials = async (searchText?: string) => {
    setIsLoading(true);
    const res = await materialProvider.getMaterials({ searchText });

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

  useEffect(() => {
    if (params.slug) {
      fetchSubjectDetail();
    }
  }, [params.slug]);

  useEffect(() => {
    if (subjectData) {
      fetchMaterials(subjectData.name);
    }
  }, [subjectData]);

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
    try {
      const res = await subjectProvider.deleteSubject(id);
      if (res.isSuccess) {
        toast.success("Mata pelajaran berhasil dihapus");
        router.push(`${baseRoute}`);
      } else {
        toast.error(res.message || "Gagal menghapus mata pelajaran");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Terjadi kesalahan saat menghapus mata pelajaran");
      }
    }
  };

  if (isLoading || !subjectData) {
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
