"use client";

import React, { useEffect, useState } from "react";
import { message } from "antd";
import { useToast } from "@/app/hooks/use-toast";
import { subjectProvider } from "@/app/functions/SubjectProvider";
import Table from "@/app/components/shared/table/Table";
import { useRouter } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import RowActions from "@/app/components/shared/table/RowActions";
import { ColumnType } from "antd/es/table";
import { DeleteConfirmationModal } from "@/app/components/modals/ConfirmationModal";

const SubjectPage = () => {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<SubjectOverviewResponse[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });
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

  const fetchSubjects = async (searchText?: string) => {
    setIsLoading(true);
    const res = await subjectProvider.getSubjects({ searchText });
    if (res.isSuccess && res.data) {
      setSubjects(
        res.data.map((s: SubjectOverviewResponse, idx: number) => ({
          key: s.subjectId ?? idx,
          ...s,
        }))
      );
    } else {
      message.error("Gagal memuat mata pelajaran");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleNavigateToCreateSubjectPage = () => {
    router.push("/dashboard/subject/create");
  };

  const handleView = (slug: string) => {
    router.push(`/dashboard/subject/${slug}`);
  };

  const handleEdit = (slug: string) => {
    router.push(`/dashboard/subject/edit/${slug}`);
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
        fetchSubjects();
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

  // Kolom tabel
  const columns: ColumnType<SubjectOverviewResponse>[] = [
    {
      title: "No",
      key: "index",
      width: 50,
      align: "center",
      fixed: "left",
      render: (_: unknown, __: SubjectOverviewResponse, index: number) =>
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
      title: "Aksi",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <RowActions
          onView={() => handleView(record.slug)}
          onEdit={() => handleEdit(record.slug)}
          onDelete={() => showDeleteModal(record.subjectId, record.name)}
        />
      ),
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <DashboardTitle title="Daftar Mata Pelajaran" showBackButton={false} />

      <Table
        columns={columns}
        data={subjects}
        rowKey="key"
        loading={isLoading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize });
          },
        }}
        onAddButtonClick={handleNavigateToCreateSubjectPage}
        searchable
        searchPlaceholder="Cari mata pelajaran…"
        onSearch={(value) => fetchSubjects(value)}
        onRefresh={() => fetchSubjects()}
      />

      <DeleteConfirmationModal
        visible={isDeleteConfirmationModalVisible}
        modalText={`Apakah kamu yakin ingin menghapus mata pelajaran dengan nama '${deleteSubjectName}'?`}
        onConfirm={confirmDeleteSubject}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default SubjectPage;
