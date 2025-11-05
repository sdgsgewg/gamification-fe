"use client";

import React, { useState } from "react";
import { useToast } from "@/app/hooks/use-toast";
import Table from "@/app/components/shared/table/Table";
import { useRouter } from "next/navigation";
import { Toaster } from "@/app/hooks/use-toast";
import { SubjectOverviewResponse } from "@/app/interface/subjects/responses/ISubjectOverviewResponse";
import DashboardTitle from "@/app/components/pages/Dashboard/DashboardTitle";
import RowActions from "@/app/components/shared/table/RowActions";
import { ColumnType } from "antd/es/table";
import { DeleteConfirmationModal } from "@/app/components/modals/ConfirmationModal";
import { ROUTES } from "@/app/constants/routes";
import { useSubjects } from "@/app/hooks/subjects/useSubjects";
import { useDeleteSubject } from "@/app/hooks/subjects/useDeleteSubject";

const ManageSubjectPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const baseRoute = ROUTES.DASHBOARD.ADMIN.MANAGE_SUBJECTS;

  const [searchText, setSearchText] = useState<string>("");
  const { data: subjects = [], isLoading, refetch } = useSubjects(searchText);
  const { mutateAsync: deleteSubject } = useDeleteSubject();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  const [deleteSubjectId, setDeleteSubjectId] = useState<string | null>(null);
  const [deleteSubjectName, setDeleteSubjectName] = useState<string | null>(null);
  const [isDeleteConfirmationModalVisible, setIsDeleteConfirmationModalVisible] =
    useState(false);

  const handleNavigateToCreateSubjectPage = () => {
    router.push(`${baseRoute}/create`);
  };

  const handleView = (slug: string) => {
    router.push(`${baseRoute}/${slug}`);
  };

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
      toast.success(message ?? "Subject deleted successfully");
      refetch();
    } else {
      toast.error(message ?? "Failed to delete subject");
    }
  };

  // Table columns
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
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 300,
      onCell: () => ({
        style: { minWidth: 300 },
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
          onDelete={() => showDeleteModal(record.subjectId, record.name)}
        />
      ),
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <DashboardTitle title="Subjects List" showBackButton={false} />

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
        searchPlaceholder="Search subjects…"
        onSearch={(value) => setSearchText(value)}
        onRefresh={() => refetch()}
      />

      <DeleteConfirmationModal
        visible={isDeleteConfirmationModalVisible}
        modalText={`Are you sure you want to delete the subject named '${deleteSubjectName}'?`}
        onConfirm={confirmDeleteSubject}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default ManageSubjectPage;